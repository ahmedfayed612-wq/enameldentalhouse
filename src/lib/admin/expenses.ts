export type ExpenseCategory = {
  id: string;
  name: string;
  name_ar: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type Expense = {
  id: string;
  expense_id: string;
  name: string;
  description: string | null;
  category: string | null;
  amount: number;
  expense_date: string;
  payment_method: string | null;
  supplier: string | null;
  attachment_url: string | null;
  recorded_by: string | null;
  payment_status: 'paid' | 'pending' | 'partial';
  recurrence_info: any;
  created_at: string;
  updated_at: string;
  expense_categories?: ExpenseCategory | null;
  profiles?: { full_name: string } | null;
};

export type CreateExpenseInput = {
  name: string;
  description?: string | null;
  category?: string | null;
  amount: number;
  expense_date?: string;
  payment_method?: string | null;
  supplier?: string | null;
  attachment_url?: string | null;
  payment_status?: 'paid' | 'pending' | 'partial';
  recurrence_info?: any;
};

export type ExpenseSummary = {
  category: string;
  category_ar: string | null;
  total_amount: number;
  count: number;
};

export type MonthlyExpenseSummary = {
  month: string;
  total_amount: number;
  count: number;
};