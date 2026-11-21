export type PaymentMethod = {
  id: string;
  name: string;
  name_ar: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'voided' | 'refunded';

export type Invoice = {
  id: string;
  invoice_number: string;
  patient_id: string;
  appointment_id: string | null;
  invoice_date: string;
  status: InvoiceStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  notes: string | null;
  created_by: string | null;
  voided_at: string | null;
  void_reason: string | null;
  created_at: string;
  updated_at: string;
  patients?: { full_name: string; phone: string | null };
  services?: { code: string; name_en: string; name_ar: string | null } | null;
  invoice_items?: InvoiceItem[];
  payments?: Payment[];
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  service_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
  created_at: string;
  services?: { code: string; name_en: string; name_ar: string | null } | null;
};

export type Payment = {
  id: string;
  payment_number: string;
  patient_id: string;
  invoice_id: string | null;
  amount: number;
  payment_method: string | null;
  payment_date: string;
  recorded_by: string | null;
  reference_number: string | null;
  receipt_number: string | null;
  notes: string | null;
  created_at: string;
  patients?: { full_name: string; phone: string | null };
  payment_methods?: PaymentMethod | null;
};

export type Receipt = {
  id: string;
  receipt_number: string;
  payment_id: string;
  patient_id: string;
  receipt_date: string;
  amount: number;
  payment_method: string | null;
  invoice_id: string | null;
  outstanding_balance: number;
  issued_by: string | null;
  created_at: string;
};

export type CreateInvoiceInput = {
  patient_id: string;
  appointment_id?: string | null;
  invoice_date?: string;
  status?: InvoiceStatus;
  subtotal?: number;
  discount?: number;
  tax?: number;
  notes?: string | null;
  items: Array<{
    service_id?: string | null;
    description: string;
    quantity?: number;
    unit_price?: number;
    discount?: number;
  }>;
};

export type CreatePaymentInput = {
  patient_id: string;
  invoice_id?: string | null;
  amount: number;
  payment_method?: string | null;
  payment_date?: string;
  recorded_by?: string | null;
  reference_number?: string | null;
  notes?: string | null;
};

export type InvoiceStats = {
  total_invoiced: number;
  total_collected: number;
  total_outstanding: number;
  invoice_count: number;
  paid_count: number;
  partially_paid_count: number;
  overdue_count: number;
  voided_count: number;
};