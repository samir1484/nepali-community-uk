import { z } from "zod";

export const USER_TYPES = [
  "STUDENT",
  "EMPLOYEE",
  "EMPLOYER",
  "LANDLORD",
  "TENANT",
  "BUSINESS_OWNER",
  "VOLUNTEER",
  "OTHER",
] as const;

export const INTERESTS = [
  "JOBS",
  "EVENTS",
  "ROOMS",
  "BLOGS",
  "NEWS",
  "HOUSING",
  "BUSINESS",
  "EDUCATION",
  "FESTIVALS",
  "TECHNOLOGY",
  "HEALTH",
  "SPORTS",
  "IMMIGRATION",
] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().min(5, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your full address"),
  location: z.string().trim().min(2, "Location is required"),
  occupation: z.string().trim().min(2, "Occupation is required"),
  userType: z.enum(USER_TYPES),
  interests: z.array(z.enum(INTERESTS)).min(1, "Select at least one interest"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
