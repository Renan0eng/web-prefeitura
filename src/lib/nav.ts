import {
  Wrench
} from "lucide-react";

const levels = ["ferramentas"]

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
      nivel_acesso: "",
      items: [
        // {
        //   title: "Scrumboard",
        //   url: "/ferramentas/scrumboard",
        // },
        {
          title: "Form Builder",
          url: "/ferramentas/formBuilder",
        },
      ],
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
