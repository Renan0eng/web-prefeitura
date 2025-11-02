import {
  ClipboardList,
  Shield,
  User,
  UserCheck
} from "lucide-react";

const levels = ["acesso", "gerenciar-usuarios", "formulario"];

export const data = {
  user: {
    name: "Ícarus",
    email: "icarus@example.com",
    avatar: "/logo.webp"
  },
  
  navMain: [
    {
      title: "Formulários",
      url: "/admin/listar-formulario",
      icon: ClipboardList,
      isActive: false,
      nivel_acesso: "formulario",
    },
    {
      title: "Controle de Acesso",
      url: "/admin/acessos",
      icon: Shield,
      isActive: false,
      nivel_acesso: "acesso",
    },
    {
      title: "Ativação de Usuários",
      url: "/admin/ativacao-usuarios",
      icon: UserCheck,
      isActive: false,
      nivel_acesso: "acesso",
    },
    {
      title: "Usuários",
      url: "/admin/usuarios",
      icon: User,
      isActive: false,
      nivel_acesso: "gerenciar-usuarios",
    },
  ],
  flow: [
    // {
    //   title: "Chegada Alevinos",
    //   url: "/admin/chegada/alevinos",
    //   icon: Fish,
    //   isActive: false,
    //   nivel_acesso: "chegada-alevinos",
    // },
    // {
    //   title: "Trato",
    //   url: "/admin/trato",
    //   icon: Ham,
    //   isActive: false,
    //   nivel_acesso: "trato",
    // },
  ],
};
