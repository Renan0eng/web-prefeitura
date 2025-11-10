import { EnumUserType } from "@/types/access-level"
import * as z from "zod"

export const userFormSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("Formato de e-mail inválido."),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
    passwordConfirmation: z.string().min(6, "Confirmação de senha deve ter no mínimo 6 caracteres."),
    avatar: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    cep: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    nivelAcessoId: z.string().min(1, "Nível de Acesso é obrigatório."),
    type: z.nativeEnum(EnumUserType),
    active: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  })
