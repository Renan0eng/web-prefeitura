import { EnumUserType } from "@/types/access-level";
import * as z from "zod";

export const userFormSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("Formato de e-mail inválido."),
    avatar: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    cep: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    // Nível de acesso é string no Select, mas número no envio
    nivelAcessoId: z.string().min(1, "Nível de Acesso é obrigatório."),
    // Tipo é string no Select
    type: z.nativeEnum(EnumUserType),
    active: z.boolean(),
})
