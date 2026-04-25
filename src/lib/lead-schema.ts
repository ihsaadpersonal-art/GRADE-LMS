import { z } from "zod";

export const leadSchema = z.object({
  studentName: z.string().min(2, "Student name is required").max(120),
  parentName: z.string().min(2, "Parent name is required").max(120),
  studentPhone: z.string().min(6, "Student phone is required").max(30),
  parentPhone: z.string().min(6, "Parent phone is required").max(30),
  whatsapp: z.string().min(6, "WhatsApp number is required").max(30),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  currentLevel: z.string().min(2, "Current level is required"),
  version: z.enum(["Bangla Version", "English Version"]),
  institution: z.string().min(2, "Institution is required").max(180),
  interestedProgramme: z.string().min(2, "Interested programme is required"),
  preferredMode: z.enum(["online", "offline", "hybrid"]),
  source: z.string().min(2, "Source is required"),
  message: z.string().max(1000).optional(),
  paymentMethod: z.enum(["bKash", "Nagad", "Bank", "Other"]).optional().or(z.literal("")),
  transactionId: z.string().max(120).optional(),
  paymentSenderNumber: z.string().max(30).optional(),
  proofUrl: z.string().url("Enter a valid proof URL").optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
