import { supabase } from "@/lib/supabase";
import type {
  Invoice,
  InvoiceItem,
  Payment,
  Receipt,
  PaymentMethod,
  CreateInvoiceInput,
  CreatePaymentInput,
  InvoiceStats,
} from "./billing";

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as PaymentMethod[];
}

export async function listInvoices({
  patientId,
  status,
  fromDate,
  toDate,
  page = 1,
  pageSize = 50,
}: {
  patientId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ invoices: Invoice[]; count: number }> {
  if (!supabase) return { invoices: [], count: 0 };
  let q = supabase
    .from("invoices")
    .select(
      `*,
      patients (full_name, phone),
      invoice_items (*, services (code, name_en, name_ar)),
      payments (*)
    `,
      { count: "exact" }
    )
    .order("invoice_date", { ascending: false });

  if (patientId) q = q.eq("patient_id", patientId);
  if (status) q = q.eq("status", status);
  if (fromDate) q = q.gte("invoice_date", fromDate);
  if (toDate) q = q.lte("invoice_date", toDate);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;
  return { invoices: (data ?? []) as Invoice[], count: count ?? 0 };
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `*,
      patients (full_name, phone),
      invoice_items (*, services (code, name_en, name_ar)),
      payments (*)
    `)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Invoice | null;
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data: numData } = await supabase.rpc("next_invoice_number");
  const invoiceNumber = (numData as string) || "INV-000000";

  const {
    patient_id,
    appointment_id,
    invoice_date,
    status = "draft",
    subtotal = 0,
    discount = 0,
    tax = 0,
    notes,
    items,
  } = input;

  const total = subtotal - discount + tax;

  const { data: invoice, error: invError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      patient_id,
      appointment_id,
      invoice_date: invoice_date || new Date().toISOString(),
      status,
      subtotal,
      discount,
      tax,
      total,
      amount_paid: 0,
      balance_due: total,
      notes,
    })
    .select()
    .single();

  if (invError) throw invError;

  if (items && items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      items.map((item, idx) => ({
        invoice_id: invoice.id,
        service_id: item.service_id ?? null,
        description: item.description,
        quantity: item.quantity ?? 1,
        unit_price: item.unit_price ?? 0,
        discount: item.discount ?? 0,
        line_total:
          (item.unit_price ?? 0) * (item.quantity ?? 1) - (item.discount ?? 0),
        sort_order: idx,
      }))
    );
    if (itemsError) throw itemsError;
  }

  return getInvoice(invoice.id).then((r) => {
    if (!r) throw new Error("Invoice created but not found");
    return r;
  });
}

export async function updateInvoice(
  id: string,
  updates: Partial<{
    status: 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'voided' | 'refunded';
    notes: string | null;
    discount: number;
    tax: number;
    void_reason: string | null;
  }>
): Promise<Invoice> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("invoices")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Invoice;
}

export async function voidInvoice(id: string, reason: string): Promise<Invoice> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("invoices")
    .update({
      status: "voided",
      voided_at: new Date().toISOString(),
      void_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Invoice;
}

export async function getInvoiceStats({
  fromDate,
  toDate,
}: {
  fromDate?: string;
  toDate?: string;
}): Promise<InvoiceStats> {
  if (!supabase) {
    return {
      total_invoiced: 0,
      total_collected: 0,
      total_outstanding: 0,
      invoice_count: 0,
      paid_count: 0,
      partially_paid_count: 0,
      overdue_count: 0,
      voided_count: 0,
    };
  }
  let q = supabase.from("invoices").select("status, total, amount_paid, balance_due");
  if (fromDate) q = q.gte("invoice_date", fromDate);
  if (toDate) q = q.lte("invoice_date", toDate);
  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as Array<{ status: string; total: number; amount_paid: number; balance_due: number }>;
  return rows.reduce<InvoiceStats>(
    (acc: InvoiceStats, r: { status: string; total: number; amount_paid: number; balance_due: number }) => {
      acc.total_invoiced += r.total;
      acc.total_collected += r.amount_paid;
      acc.total_outstanding += r.balance_due;
      acc.invoice_count += 1;
      if (r.status === "paid") acc.paid_count += 1;
      else if (r.status === "partially_paid") acc.partially_paid_count += 1;
      else if (r.status === "overdue") acc.overdue_count += 1;
      else if (r.status === "voided") acc.voided_count += 1;
      return acc;
    },
    {
      total_invoiced: 0,
      total_collected: 0,
      total_outstanding: 0,
      invoice_count: 0,
      paid_count: 0,
      partially_paid_count: 0,
      overdue_count: 0,
      voided_count: 0,
    }
  );
}

/** ========================================================================
 *  PAYMENTS
 * ======================================================================== */

export async function listPayments({
  patientId,
  invoiceId,
  fromDate,
  toDate,
  page = 1,
  pageSize = 50,
}: {
  patientId?: string;
  invoiceId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ payments: Payment[]; count: number }> {
  if (!supabase) return { payments: [], count: 0 };
  let q = supabase
    .from("payments")
    .select(`*, patients (full_name, phone), payment_methods (*)`, {
      count: "exact",
    })
    .order("payment_date", { ascending: false });

  if (patientId) q = q.eq("patient_id", patientId);
  if (invoiceId) q = q.eq("invoice_id", invoiceId);
  if (fromDate) q = q.gte("payment_date", fromDate);
  if (toDate) q = q.lte("payment_date", toDate);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;
  return { payments: (data ?? []) as Payment[], count: count ?? 0 };
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data: numData } = await supabase.rpc("next_payment_number");
  const paymentNumber = (numData as string) || "PAY-000000";

  const { data, error } = await supabase
    .from("payments")
    .insert({
      payment_number: paymentNumber,
      patient_id: input.patient_id,
      invoice_id: input.invoice_id ?? null,
      amount: input.amount,
      payment_method: input.payment_method ?? null,
      payment_date: input.payment_date || new Date().toISOString(),
      recorded_by: input.recorded_by ?? null,
      reference_number: input.reference_number ?? null,
      notes: input.notes ?? null,
    })
    .select(`*, patients (full_name, phone), payment_methods (*)`)
    .single();

  if (error) throw error;
  return data as Payment;
}

/** ========================================================================
 *  RECEIPTS
 * ======================================================================== */

export async function listReceipts({
  patientId,
  fromDate,
  toDate,
}: {
  patientId?: string;
  fromDate?: string;
  toDate?: string;
} = {}): Promise<Receipt[]> {
  if (!supabase) return [];
  let q = supabase
    .from("receipts")
    .select("*")
    .order("receipt_date", { ascending: false });
  if (patientId) q = q.eq("patient_id", patientId);
  if (fromDate) q = q.gte("receipt_date", fromDate);
  if (toDate) q = q.lte("receipt_date", toDate);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Receipt[];
}

export async function generateReceipt(paymentId: string): Promise<Receipt | null> {
  if (!supabase) return null;

  const { data: payment, error: payError } = await supabase
    .from("payments")
    .select(`*, patients (*)`)
    .eq("id", paymentId)
    .maybeSingle();
  if (payError) throw payError;
  if (!payment) return null;

  const { data: existing } = await supabase
    .from("receipts")
    .select("*")
    .eq("payment_id", paymentId)
    .maybeSingle();
  if (existing) return existing as Receipt;

  const { data: numData } = await supabase.rpc("next_receipt_number");
  const receiptNumber = (numData as string) || "RCT-000000";

  const { data: invoices } = await supabase
    .from("invoices")
    .select("balance_due")
    .eq("patient_id", payment.patient_id)
    .neq("status", "voided");
  const outstanding = (invoices ?? []).reduce(
    (acc, inv) => acc + (inv.balance_due || 0),
    0
  );

  const { data: receipt, error } = await supabase
    .from("receipts")
    .insert({
      receipt_number: receiptNumber,
      payment_id: paymentId,
      patient_id: payment.patient_id,
      receipt_date: payment.payment_date,
      amount: payment.amount,
      payment_method: payment.payment_method ?? undefined,
      invoice_id: payment.invoice_id ?? null,
      outstanding_balance: outstanding,
      issued_by: payment.recorded_by ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return receipt as Receipt;
}

export async function updateInvoicePaymentStatus(
  invoiceId: string,
  amountPaid: number
): Promise<void> {
  if (!supabase) return;
  const { data: invoice } = await supabase
    .from("invoices")
    .select("total, amount_paid, status")
    .eq("id", invoiceId)
    .maybeSingle();
  if (!invoice) return;

  const newAmountPaid = (invoice.amount_paid || 0) + amountPaid;
  const newBalanceDue = invoice.total - newAmountPaid;
  let newStatus: string = invoice.status;
  if (newBalanceDue <= 0) newStatus = "paid";
  else if (newAmountPaid > 0) newStatus = "partially_paid";

  await supabase
    .from("invoices")
    .update({
      amount_paid: newAmountPaid,
      balance_due: newBalanceDue,
      status: newStatus as any,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId);
}