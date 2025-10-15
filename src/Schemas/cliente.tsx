import * as z from "zod";

export const cadastroClienteSchema = z.object({
  Contatos: z.array(
    z.object({
      nome: z.string().min(1, 'Nome é obrigatório'),
      email: z.string().email('E-mail inválido').optional(),
      telefone: z.string().optional(),
      principal: z.boolean()
    })
  ).optional(),
  Enderecos: z.array(
    z.object({
      rua: z.string().min(1, 'Rua é obrigatória'),
      numero: z.string().min(1, 'Número é obrigatório'),
      complemento: z.string().optional(),
      bairro: z.string().min(1, 'Bairro é obrigatório'),
      cidade: z.string().min(1, 'Cidade é obrigatória'),
      estado: z.string().min(2, 'Estado é obrigatório'),
      cep: z.string().min(8, 'CEP é obrigatório'),
      principal: z.boolean()
    })
  ).optional(),
  id: z.string().optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  ie: z.string().optional(),
  rg: z.string().optional(),
  razao_social: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  inscricao_estadual: z.string().optional(),
});


export type CadastroClienteSchema = z.infer<typeof cadastroClienteSchema>;
