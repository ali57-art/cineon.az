import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(72, { message: "Password must be less than 72 characters" }),
  fullName: z
    .string()
    .trim()
    .max(100, { message: "Name must be less than 100 characters" })
    .optional(),
});

export type AuthFormData = z.infer<typeof authSchema>;