import { z } from "zod"

// Auth schemas
export const registerSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
        .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
})

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
})

// Booking schemas
export const createBookingSchema = z.object({
    businessId: z.string().uuid("ID da empresa inválido"),
    servicoId: z.string().uuid("ID do serviço inválido"),
    dataHora: z.string().datetime("Data/hora inválida"),
    clienteNome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    clienteWhats: z
        .string()
        .regex(/^\d{10,11}$/, "WhatsApp deve ter 10 ou 11 dígitos (DDD + número)"),
    joinWaitlist: z.boolean().optional().default(false),
})

// Business settings schema
export const businessSettingsSchema = z.object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    endereco: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().length(2, "Estado deve ter 2 letras (ex: SP)").optional(),
    telefoneWhats: z
        .string()
        .regex(/^\d{10,11}$/, "WhatsApp deve ter 10 ou 11 dígitos"),
    politicaCancel: z.string().optional(),
    autoReplyEnabled: z.boolean().optional(),
    autoReplyConfig: z.any().optional(),
})

// WhatsApp test schema
export const whatsappTestSchema = z.object({
    phoneNumber: z
        .string()
        .regex(/^\d{10,11}$/, "Número deve ter 10 ou 11 dígitos"),
    message: z.string().min(1, "Mensagem é obrigatória"),
})

// Types inferred from schemas
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>
export type WhatsAppTestInput = z.infer<typeof whatsappTestSchema>
