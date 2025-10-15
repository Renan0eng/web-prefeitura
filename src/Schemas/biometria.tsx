import * as z from "zod";

export const cadastroBiometriaSchema = z.object({
  id: z.string().optional(),
  id_tanque: z.string().optional(),
  id_lote: z.string().optional(),
  descricao: z.string().optional(),
  Bio: z.array(
    z.object({
      id: z.string().optional(),
      kg: z.number(),
      qtd: z.number(),
      bio: z.number(),
      biometria_id: z.string().optional(),
    })
  ).min(1, "Deve conter pelo menos um valor"),
  media_bio: z.number(),
  data_bio: z.date().default(new Date()),
});


export type CadastroBiometriaSchema = z.infer<typeof cadastroBiometriaSchema>;
