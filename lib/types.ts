export type Step = "landing" | "phone" | "otp" | "form" | "success";

export interface FormPayload {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  signature: string;
  timestamp: number;
}
