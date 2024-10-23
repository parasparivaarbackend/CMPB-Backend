import { z } from "zod";

export const UserSchemaValidation = z.object({
  email: z.string(),
  password: z.string().min(6).max(16),
  gender: z.enum(["male", "female"]),
  role: z.enum(["user", "admin"]),
});
