import type { Tables } from "@/types/database.types";

export type ProfileRole = "admin" | "viewer";

export type ProfileRow = Tables<"profiles"> & {
  role: ProfileRole;
};

export type SessionUserWithProfile = {
  id: string;
  email?: string;
  role: ProfileRole;
  fullName: string | null;
};
