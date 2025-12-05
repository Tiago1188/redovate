import type { PlanType } from "./plan";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  plan_type: PlanType | null;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithBusiness extends User {
  businesses: UserBusiness[];
}

export interface UserBusiness {
  id: string;
  business_name: string;
  slug: string;
  status: "active" | "pending" | "suspended";
}

