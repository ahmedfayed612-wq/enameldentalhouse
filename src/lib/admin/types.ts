export type StaffRole = "owner" | "manager" | "receptionist" | "dentist" | "accountant";

export type Profile = {
  id: string;
  full_name: string;
  role: StaffRole;
  phone: string | null;
  active: boolean;
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  owner: "Owner",
  manager: "Manager",
  receptionist: "Receptionist",
  dentist: "Dentist",
  accountant: "Accountant",
};

/** Roles allowed into the admin area at all (Phase 1: everyone except none). */
export const ADMIN_ROLES: StaffRole[] = [
  "owner",
  "manager",
  "receptionist",
  "dentist",
  "accountant",
];
