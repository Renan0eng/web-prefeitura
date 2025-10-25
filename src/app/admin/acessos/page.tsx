import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GerenciarAtribuicaoUsuarios } from "@/views/admin/access-level/gerenciar-atribuicao-usuarios"
import { GerenciarMenusSistema } from "@/views/admin/access-level/gerenciar-menus-sistema"
import { GerenciarNiveisAcesso } from "@/views/admin/access-level/gerenciar-niveis-acesso"
import { PanelLeft, ShieldCheck, Users } from "lucide-react"

export default function PaginaAcessos() {
    return (
        <div className=" mx-auto p-2 md:p-4">
            <h1 className="text-3xl font-bold tracking-tight mb-6">
                Controle de Acesso
            </h1>

            <Tabs defaultValue="niveis" className="w-full">
                <TabsList className="max-w-full md:col">
                    <TabsTrigger value="niveis">
                        <ShieldCheck className="h-4 mr-2" />
                        Níveis de Acesso 
                    </TabsTrigger>
                    <TabsTrigger value="menus">
                        <PanelLeft className="h-4 mr-2" />
                        Menus do Sistema
                    </TabsTrigger>
                    <TabsTrigger value="usuarios">
                        <Users className="h-4 mr-2" />
                        Atribuição de Usuários
                    </TabsTrigger>
                </TabsList>

                {/* Aba 1: Gerenciar Níveis de Acesso (Nivel_Acesso) */}
                <TabsContent value="niveis">
                    <GerenciarNiveisAcesso />
                </TabsContent>

                {/* Aba 2: Gerenciar Menus e Permissões (Menu_Acesso) */}
                <TabsContent value="menus">
                    <GerenciarMenusSistema />
                </TabsContent>

                {/* Aba 3: Gerenciar Usuários e seus níveis (User) */}
                <TabsContent value="usuarios">
                    <GerenciarAtribuicaoUsuarios />
                </TabsContent>
            </Tabs>
        </div>
    )
}