export type NivelAcesso = {
  idNivelAcesso: number;
  nome: string;
  descricao: string | null;
}

export type MenuAcesso = {
  idMenuAcesso: number;
  nome: string;
  slug: string;
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
  relatorio: boolean;
}

export enum EnumUserType {
  ADMIN = "ADMIN",
  USUARIO = "USUARIO",
  PACIENTE = "PACIENTE"
}

export type User = {
  idUser: string;
  name: string;
  avatar: string | null;
  email: string;
  cpf: string | null;
  cep: string | null;
  phone: string | null;
  created: string; 
  updated: string | null; 
  active: boolean;
  nivelAcessoId: number;
  type: EnumUserType;
}

export type MenuAcessoComNiveis = MenuAcesso & {
  nivel_acesso: NivelAcesso[]
}

export type UserComNivel = User & {
  nivel_acesso: NivelAcesso
}

export type UserFormData = {
    name: string;
    email: string;
    password?: string; 
    passwordConfirmation?: string;
    avatar?: string | null;
    cpf?: string | null;
    cep?: string | null;
    phone?: string | null;
    nivelAcessoId: number;
    type: EnumUserType;
    active: boolean;
};