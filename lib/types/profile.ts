export type ProfileRole = "admin" | "viewer";

export type ProfileRow = {
  id: string;
  role: ProfileRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type SessionUserWithProfile = {
  id: string;
  email?: string;
  role: ProfileRole;
  fullName: string | null;
};
