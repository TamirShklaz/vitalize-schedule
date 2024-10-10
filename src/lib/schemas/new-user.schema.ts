import {z} from "zod";

export const newUserSchema = z.object({
    name: z.string(),
    email: z.string().email()
})

export type NewUser = z.infer<typeof newUserSchema>