export type Patient = {
  id: string;
  patient_no: number;
  full_name: string;
  phone: string | null;
  phone_raw: string | null;
  email: string | null;
  dob: string | null;
  gender: 'male' | 'female' | 'other' | null;
  address: string | null;
  notes: string | null;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
  appointments_count?: number;
  total_spent?: number;
  outstanding_balance?: number;
};

export type CreatePatientInput = {
  full_name: string;
  phone: string;
  email?: string | null;
  dob?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  address?: string | null;
  notes?: string | null;
  tags?: string[];
};

export type UpdatePatientInput = {
  full_name?: string;
  phone?: string;
  email?: string | null;
  dob?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  address?: string | null;
  notes?: string | null;
  tags?: string[];
};

export type PatientImportResult = {
  valid_records: number;
  imported_records: number;
  skipped_records: number;
  failed_records: number;
  duplicate_records: number;
  errors: Array<{ row: number; field: string; message: string }>;
  duplicates: Array<{ row: number; patient_id: string; reason: string }>;
};

export type CSVImportPreview = {
  headers: string[];
  rows: Array<Record<string, string>>;
  total_rows: number;
  suggested_mapping: Record<string, string>;
};