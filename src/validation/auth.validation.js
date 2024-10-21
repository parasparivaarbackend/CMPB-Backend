import {z} from 'zod'

export const UserSchemaValidation = z.object({
    email:z.string().email(),
    phone:z.string().min(10).max(12),
    password:z.string().min(6).max(16),
    role:z.enum(["user", "admin"])
})