import { supabase } from "@/lib/supabase";
import type {
  TreatmentPlan,
  TreatmentPlanItem,
  CreateTreatmentPlanInput,
  UpdateTreatmentPlanItemInput,
} from "./treatment";

export async function listTreatmentPlans({
  patientId,
  status,
}: {
  patientId?: string;
  status?: string;
} = {}): Promise<TreatmentPlan[]> {
  if (!supabase) return [];
  let q = supabase
    .from("treatment_plans")
    .select(`, items (*), patients (full_name, phone)`)
    .order("created_at", { ascending: false });
  if (patientId) q = q.eq("patient_id", patientId);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as TreatmentPlan[];
}

export async function getTreatmentPlan(id: string): Promise<TreatmentPlan | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("treatment_plans")
    .select(`, items (*, services (code, name_en, name_ar)), patients (*)`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as TreatmentPlan | null;
}

export async function createTreatmentPlan(input: CreateTreatmentPlanInput): Promise<TreatmentPlan> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data: numData } = await supabase.rpc("next_treatment_plan_id");
  const planId = (numData as string) || "TP-000000";

  const { patient_id, title, status = "planned", notes, items } = input;

  const { data: plan, error: planError } = await supabase
    .from("treatment_plans")
    .insert({
      plan_id: planId,
      patient_id,
      title,
      status,
      notes,
    })
    .select()
    .single();

  if (planError) throw planError;

  if (items && items.length > 0) {
    const { error: itemsError } = await supabase.from("treatment_plan_items").insert(
      items.map((item, idx) => ({
        treatment_plan_id: plan.id,
        service_id: item.service_id ?? null,
        description: item.description,
        estimated_price: item.estimated_price ?? null,
        status: item.status || "planned",
        associated_appointment_id: item.associated_appointment_id ?? null,
        completion_date: item.completion_date ?? null,
        notes: item.notes ?? null,
        sort_order: item.sort_order ?? idx,
      }))
    );
    if (itemsError) throw itemsError;
  }

  return getTreatmentPlan(plan.id).then((r) => {
    if (!r) throw new Error("Treatment plan created but not found");
    return r;
  });
}

export async function updateTreatmentPlan(
  id: string,
  updates: Partial<{
    title: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    notes: string | null;
  }>
): Promise<TreatmentPlan> {
  if (!supabase) throw new Error("Supabase not configured");
  const updateData: Record<string, any> = { ...updates, updated_at: new Date().toISOString() };
  if (updates.status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from("treatment_plans")
    .update(updateData)
    .eq("id", id)
    .select(`, items (*)`)
    .single();
  if (error) throw error;
  return (data as unknown) as TreatmentPlan;
}

export async function updateTreatmentPlanItem(
  itemId: string,
  input: UpdateTreatmentPlanItemInput
): Promise<TreatmentPlanItem> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("treatment_plan_items")
    .update(input)
    .eq("id", itemId)
    .select()
    .single();
  if (error) throw error;
  return data as TreatmentPlanItem;
}