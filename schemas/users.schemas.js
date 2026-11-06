import * as z from "zod"

export const userQuerySchema = z.object({
    name: z.optional(z.string().trim().min(1))
})

export const userBodySchema = z.object({
    name: z.string().trim().min(1)
})

export const idParamsSchema = z.object({
    id: z.string().regex(/^[1-9]\d*$/).transform(val => Number(val))
})