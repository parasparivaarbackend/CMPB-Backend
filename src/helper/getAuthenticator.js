import { z } from "zod";

const emailSchema = z.string().email("Invalid email");

const phoneSchema = z
  .string()
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^\d{10}$/, "Phone number must contain only digits");

export default function getAuthenticator(data) {
  const email = emailSchema.safeParse(data.identifier);
  const phone = phoneSchema.safeParse(data.identifier);

  if (email.success) return "email";
  if (phone.success) return "phone";
  return null;
}
