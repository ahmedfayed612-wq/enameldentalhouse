import { supabase } from "@/lib/supabase";
import type { Patient, CreatePatientInput, UpdatePatientInput, PatientImportResult, CSVImportPreview } from "./patients";

export async function listPatients({
  search,
  page = 1,
  pageSize = 50,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ patients: Patient[]; count: number }> {
  if (!supabase) return { patients: [], count: 0 };
  let q = supabase
    .from("patients")
    .select(`*`, { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;
  return { patients: (data ?? []) as Patient[], count: count ?? 0 };
}

export async function getPatient(id: string): Promise<Patient | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("patients")
    .select(`*, appointments (*)`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Patient | null;
}

export async function createPatient(input: CreatePatientInput): Promise<Patient> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("patients")
    .insert({
      full_name: input.full_name,
      phone: input.phone,
      email: input.email ?? null,
      dob: input.dob ?? null,
      gender: input.gender ?? null,
      address: input.address ?? null,
      notes: input.notes ?? null,
      tags: input.tags ?? [],
    })
    .select()
    .single();
  if (error) throw error;
  return data as Patient;
}

export async function updatePatient(id: string, input: UpdatePatientInput): Promise<Patient> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("patients")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Patient;
}

export async function previewCSV(file: File): Promise<CSVImportPreview> {
  const text = await file.text();
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [], total_rows: 0, suggested_mapping: {} };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });

  const suggestedMapping: Record<string, string> = {};
  for (const h of headers) {
    const lower = h.toLowerCase();
    if (lower.includes("name")) suggestedMapping[h] = "full_name";
    else if (lower.includes("phone")) suggestedMapping[h] = "phone";
    else if (lower.includes("email")) suggestedMapping[h] = "email";
    else if (lower.includes("dob") || lower.includes("birth")) suggestedMapping[h] = "dob";
    else if (lower.includes("gender")) suggestedMapping[h] = "gender";
    else if (lower.includes("address")) suggestedMapping[h] = "address";
    else if (lower.includes("tag")) suggestedMapping[h] = "tags";
  }

  return { headers, rows, total_rows: rows.length, suggested_mapping: suggestedMapping };
}

export async function importPatients(
  rows: Array<Record<string, string>>,
  mapping: Record<string, string>,
  userId: string
): Promise<PatientImportResult> {
  if (!supabase) throw new Error("Supabase not configured");

  const result: PatientImportResult = {
    valid_records: 0,
    imported_records: 0,
    skipped_records: 0,
    failed_records: 0,
    duplicate_records: 0,
    errors: [],
    duplicates: [],
  };

  const normalizePhone = (phone: string): string => {
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("00")) cleaned = cleaned.slice(2);
    if (cleaned.startsWith("20") && cleaned.length === 12) cleaned = "0" + cleaned.slice(2);
    return cleaned;
  };

  const { data: existingPatients } = await supabase
    .from("patients")
    .select("id, full_name, phone");
  const existingPhones = new Set((existingPatients ?? []).map((p: any) => p.phone));

  const validRows: Array<{ full_name: string; phone: string; email?: string; dob?: string; gender?: string; address?: string; notes?: string; tags?: string[] }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;
    const full_name = row[mapping.full_name] || row["name"] || "";
    const phoneRaw = row[mapping.phone] || row["phone"] || "";
    const phone = normalizePhone(phoneRaw);

    if (!full_name || !phone) {
      result.errors.push({ row: rowNum, field: "full_name/phone", message: "Missing name or phone" });
      result.failed_records++;
      continue;
    }

    if (existingPhones.has(phone)) {
      const existing = (existingPatients ?? []).find((p: any) => p.phone === phone);
      result.duplicates.push({ row: rowNum, patient_id: existing?.id || "", reason: "Phone already exists" });
      result.duplicate_records++;
      continue;
    }

    validRows.push({
      full_name,
      phone,
      email: row[mapping.email] || row["email"] || undefined,
      dob: row[mapping.dob] || row["dob"] || undefined,
      gender: row[mapping.gender] || row["gender"] || undefined,
      address: row[mapping.address] || row["address"] || undefined,
      notes: row[mapping.notes] || row["notes"] || undefined,
      tags: row[mapping.tags] ? row[mapping.tags].split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
    result.valid_records++;
  }

  if (validRows.length > 0) {
    const { error: insertError } = await supabase
      .from("patients")
      .insert(
        validRows.map((r) => ({
          full_name: r.full_name,
          phone: r.phone,
          email: r.email,
          dob: r.dob,
          gender: r.gender,
          address: r.address,
          notes: r.notes,
          tags: r.tags,
          created_by: userId,
        }))
      );
    if (insertError) throw insertError;
    result.imported_records = validRows.length;
  }

  await supabase.from("import_logs").insert({
    user_id: userId,
    file_name: "upload.csv",
    valid_records: result.valid_records,
    imported_records: result.imported_records,
    skipped_records: result.skipped_records,
    failed_records: result.failed_records,
    duplicate_records: result.duplicate_records,
    import_report: result,
  });

  return result;
}