import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { supabase } from "@/lib/supabase";
import { getInvoice } from "@/lib/admin/billing.service";
import type { Invoice } from "@/lib/admin/billing";
import { FileText, Mail, Phone, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/billing/$invoiceId")({
  component: InvoiceDetailPage,
});

function InvoiceDetailPage() {
  const { state } = useAdminAuth();
  // $FlowFixMe - TanStack Router v1 useParams
  const { invoiceId = "" } = useParams() || {};
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;
    setLoading(true);
    getInvoice(invoiceId).then((inv) => {
      setInvoice(inv);
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load invoice");
      setLoading(false);
    });
  }, [invoiceId, toast]);

  if (loading || !invoice) {
    return (
      <RequireAuth>
        <AdminShell>
          <div className="flex min-h-screen items-center justify-center bg-muted/40">
            <div className="h-10 w-10 animate-pulse rounded-full bg-primary/30" />
          </div>
        </AdminShell>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AdminShell>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Invoice {invoice.invoice_number}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{invoice.patients?.full_name ?? "Patient"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link to="/admin/billing">← Back</Link></Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${invoice.total.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-deep">${invoice.amount_paid.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">${invoice.balance_due.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="capitalize">{invoice.status}</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Line Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(invoice.invoice_items ?? []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                          <TableCell>${item.line_total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline">Record Payment</Button>
            <Button variant="outline">Download Receipt</Button>
            <Button variant="outline">Email Invoice</Button>
          </div>
        </div>
      </AdminShell>
    </RequireAuth>
  );
}