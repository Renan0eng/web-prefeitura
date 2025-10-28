import {
  Shield,
  User,
  UserCheck,
  Wrench
} from "lucide-react";

const levels = ["ferramentas", "acesso"]

export const data = {
  user: {
    name: "Ícarus",
    email: "icarus@example.com",
    avatar: "/logo.webp"
  },
  navMain: [
    {
      title: "Ferramentas",
      url: "#",
      icon: Wrench,
      isActive: false,
      nivel_acesso: "ferramentas",
      items: [
        // {
        //   title: "Scrumboard",
        //   url: "/ferramentas/scrumboard",
        // },
        {
          title: "Criar Formulário",
          url: "/admin/ferramentas/formBuilder",
        },
        {
          title: "Listar Formulários",
          url: "/admin/ferramentas/formList",
        },
      ],
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
