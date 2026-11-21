export type TreatmentPlanStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export type TreatmentPlanItem = {
  id: string;
  treatment_plan_id: string;
  service_id: string | null;
  description: string;
  estimated_price: number | null;
  status: TreatmentPlanStatus;
  associated_appointment_id: string | null;
  completion_date: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  services?: { code: string; name_en: string; name_ar: string | null } | null;
};

export type TreatmentPlan = {
  id: string;
  plan_id: string;
  patient_id: string;
  title: string;
  status: TreatmentPlanStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  patients?: { full_name: string; phone: string | null };
  items?: TreatmentPlanItem[];
};

export type CreateTreatmentPlanInput = {
  patient_id: string;
  title: string;
  status?: TreatmentPlanStatus;
  notes?: string | null;
  items: Array<{
    service_id?: string | null;
    description: string;
    estimated_price?: number | null;
    status?: TreatmentPlanStatus;
    associated_appointment_id?: string | null;
    completion_date?: string | null;
    notes?: string | null;
    sort_order?: number;
  }>;
};

export type UpdateTreatmentPlanItemInput = {
  status?: TreatmentPlanStatus;
  completion_date?: string | null;
  notes?: string | null;
  estimated_price?: number | null;
};