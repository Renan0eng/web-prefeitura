import { GerenciarMenusAcesso } from "@/views/admin/access-level/gerenciar-menus-acesso"
// import { GerenciarAtribuicaoUsuarios } from "@/views/admin/access-level/gerenciar-atribuicao-usuarios"
import { Separator } from "@/components/ui/separator"

export default function PaginaAcessos() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Controle de Acesso
        </h1>
        <p className="text-muted-foreground">
          Gerencie os menus, permissões e níveis de acesso do sistema.
        </p>
      </div>

      {/* Componente 1: Gerenciador de Menus e Níveis */}
      <GerenciarMenusAcesso />

      <Separator />

      {/* Componente 2: Gerenciador de Atribuição de Usuários */}
      {/* <GerenciarAtribuicaoUsuarios /> */}
    </div>
  )
}