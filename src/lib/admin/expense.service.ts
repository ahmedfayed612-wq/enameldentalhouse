import { supabase } from "@/lib/supabase";
import type { Expense, ExpenseCategory, CreateExpenseInput, ExpenseSummary, MonthlyExpenseSummary } from "./expenses";

export async function listExpenseCategories(): Promise<ExpenseCategory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("expense_categories")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as ExpenseCategory[];
}

export async function listExpenses({
  category,
  fromDate,
  toDate,
  page = 1,
  pageSize = 50,
}: {
  category?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ expenses: Expense[]; count: number }> {
  if (!supabase) return { expenses: [], count: 0 };
  let q = supabase
    .from("expenses")
    .select(`*, expense_categories (*), profiles (full_name)`)
    .order("expense_date", { ascending: false });

  if (category) q = q.eq("category", category);
  if (fromDate) q = q.gte("expense_date", fromDate);
  if (toDate) q = q.lte("expense_date", toDate);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;
  return { expenses: (data ?? []) as Expense[], count: count ?? 0 };
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data: numData } = await supabase.rpc("next_expense_id");
  const expenseId = (numData as string) || "EXP-000000";

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      expense_id: expenseId,
      name: input.name,
      description: input.description ?? null,
      category: input.category ?? null,
      amount: input.amount,
      expense_date: input.expense_date || new Date().toISOString(),
      payment_method: input.payment_method ?? null,
      supplier: input.supplier ?? null,
      attachment_url: input.attachment_url ?? null,
      payment_status: input.payment_status || "paid",
      recurrence_info: input.recurrence_info ?? null,
    })
    .select(`*, expense_categories (*), profiles (full_name)`)
    .single();

  if (error) throw error;
  return data as Expense;
}

export async function getExpenseSummaries({
  fromDate,
  toDate,
}: {
  fromDate?: string;
  toDate?: string;
}): Promise<ExpenseSummary[]> {
  if (!supabase) return [];
  let q = supabase
    .from("expenses")
    .select("amount, expense_categories (name, name_ar)");
  if (fromDate) q = q.gte("expense_date", fromDate);
  if (toDate) q = q.lte("expense_date", toDate);
  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as unknown as Array<{
    amount: number;
    expense_categories: { name: string; name_ar: string | null } | null;
  }>;
  const map = new Map<string, { category: string; category_ar: string | null; total: number; count: number }>();
  for (const r of rows) {
    const key = r.expense_categories?.name || "uncategorized";
    if (!map.has(key)) {
      map.set(key, { category: key, category_ar: r.expense_categories?.name_ar ?? null, total: 0, count: 0 });
    }
    const entry = map.get(key)!;
    entry.total += r.amount;
    entry.count += 1;
  }
  return Array.from(map.values()).map(({ category, category_ar, total, count }) => ({
    category,
    category_ar,
    total_amount: total,
    count,
  }));
}

export async function getMonthlyExpenseSummaries({
  fromDate,
  toDate,
}: {
  fromDate?: string;
  toDate?: string;
}): Promise<MonthlyExpenseSummary[]> {
  if (!supabase) return [];
  let q = supabase.from("expenses").select("amount, expense_date");
  if (fromDate) q = q.gte("expense_date", fromDate);
  if (toDate) q = q.lte("expense_date", toDate);
  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as Array<{ amount: number; expense_date: string }>;
  const map = new Map<string, { total: number; count: number }>();
  for (const r of rows) {
    const month = r.expense_date.slice(0, 7);
    if (!map.has(month)) map.set(month, { total: 0, count: 0 });
    const entry = map.get(month)!;
    entry.total += r.amount;
    entry.count += 1;
  }
  return Array.from(map.entries())
    .map(([month, { total, count }]) => ({ month, total_amount: total, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}