import * as z from "zod";

export const typeMedEnum = z.enum(["unidade", "kg"]);

export const cadastroMortalidadeSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().optional(),
  qtd: z.number().refine((val) => val >= 0, {
    message: "A quantidade deve ser maior ou igual a 0",
  }),
  data_morte: z.date().optional(),
  id_lote: z.string().optional(),
  id_tanque: z.string().optional(),
}).refine(data => data.id_lote || data.id_tanque, {
  message: "Destino obrigatório",
  path: ["id_lote"],
});

export type CadastroMortalidadeSchema = z.infer<typeof cadastroMortalidadeSchema>;
