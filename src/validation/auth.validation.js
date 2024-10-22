import {z} from 'zod'

export const UserSchemaValidation = z.object({
    email:z.string().email(),
    firstName:z.string().min(2),
    lastName:z.string().min(2),
    phone:z.string().min(10).max(12),
    password:z.string().min(6).max(16),
    gender:z.enum(["male", "female"]),
    role:z.enum(["user", "admin"])
})