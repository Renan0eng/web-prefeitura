"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { GerenciarAtribuicaoUsuarios } from "@/views/admin/access-level/gerenciar-atribuicao-usuarios";
import { GerenciarMenusSistema } from "@/views/admin/access-level/gerenciar-menus-sistema";
import { GerenciarNiveisAcesso } from "@/views/admin/access-level/gerenciar-niveis-acesso";
import { PanelLeft, ShieldCheck, Users } from "lucide-react";
import { useMemo } from "react";

export default function PaginaAcessos() {
    const { getPermissions, loading } = useAuth()

    const perms = useMemo(() => ({
        niveis: getPermissions("acesso"),
        menus: getPermissions("acesso"),
        usuarios: getPermissions("acesso"),
    }), [getPermissions])

    const defaultTab = useMemo(() => {
        if (perms.niveis?.visualizar) return "niveis"
        if (perms.menus?.visualizar) return "menus"
        if (perms.usuarios?.visualizar) return "usuarios"
        return "" 
    }, [perms])

    if (!loading && !defaultTab) {
        return (
            <div className=" mx-auto p-2 md:p-4">
                <h1 className="text-3xl font-bold tracking-tight mb-6">
                    Controle de Acesso
                </h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Acesso Negado</CardTitle>
                        <CardDescription>
                            Você não tem permissão para acessar esta seção.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className=" mx-auto p-2 md:p-4">
            <h1 className="text-3xl font-bold tracking-tight mb-6">
                Controle de Acesso
            </h1>

            <Tabs defaultValue="niveis" className="w-full">
                <TabsList className="max-w-full md:col mb-2">
                    {perms.niveis?.visualizar && (
                        <TabsTrigger value="niveis" className="md:justify-start">
                            <ShieldCheck className="h-4 mr-2" />
                            Níveis de Acesso
                        </TabsTrigger>
                    )}
                    {perms.menus?.visualizar && (
                        <TabsTrigger value="menus" className="md:justify-start">
                            <PanelLeft className="h-4 mr-2" />
                            Menus do Sistema
                        </TabsTrigger>
                    )}
                    {perms.usuarios?.visualizar && (
                        <TabsTrigger value="usuarios" className="md:justify-start">
                            <Users className="h-4 mr-2" />
                            Atribuição de Usuários
                        </TabsTrigger>
                    )}
                </TabsList>

                    {perms.niveis?.visualizar && (
                        <TabsContent value="niveis" className="mt-0">
                            <GerenciarNiveisAcesso />
                        </TabsContent>
                    )}

                    {perms.menus?.visualizar && (
                        <TabsContent value="menus" className="mt-0">
                            <GerenciarMenusSistema />
                        </TabsContent>
                    )}

                    {perms.usuarios?.visualizar && (
                        <TabsContent value="usuarios" className="mt-0">
                            <GerenciarAtribuicaoUsuarios />
                        </TabsContent>
                    )}
            </Tabs>
        </div>
    )
}