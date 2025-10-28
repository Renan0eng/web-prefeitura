"use client"

import { MenuAcessoDialog } from "@/components/access-level/menu-acesso-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAlert } from "@/hooks/use-alert"
import { useAuth } from "@/hooks/use-auth"; // Importa
import api from "@/services/api"
import { MenuAcesso } from "@/types/access-level"
import { Loader2, MoreHorizontal, PlusCircle } from "lucide-react"
import * as React from "react"

export function GerenciarMenusSistema() {
    const [menus, setMenus] = React.useState<MenuAcesso[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingMenu, setEditingMenu] = React.useState<MenuAcesso | null>(null)

    const { setAlert } = useAlert()
    const { getPermissions } = useAuth() // Pega a função

    // Define permissões
    const permissions = React.useMemo(
        () => getPermissions("acesso"),
        [getPermissions]
    )

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await api.get('/admin/acesso/menus')
            setMenus(response.data)
        } catch (err: any) {
            setAlert(err.response?.data?.message || "Erro ao carregar menus.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleAddNew = () => {
        setEditingMenu(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (menu: MenuAcesso) => {
        setEditingMenu(menu)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este menu?")) return
        try {
            await api.delete(`/admin/acesso/menus/${id}`)
            setAlert("Menu excluído com sucesso!", "success")
            fetchData()
        } catch (err: any) {
            setAlert(err.response?.data?.message || "Erro ao excluir menu.", "error")
        }
    }

    // Bloqueia a tela inteira se não tiver permissão de visualizar
    if (isLoading) {
        return <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
    }

    if (!permissions?.visualizar) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Acesso Negado</CardTitle>
                    <CardDescription>
                        Você não tem permissão para visualizar esta seção.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Menus do Sistema</CardTitle>
                    <CardDescription>
                        Crie os menus e defina suas permissões base.
                    </CardDescription>
                </div>
                {/* Controla o botão "Novo" */}
                {permissions?.criar && (
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Novo Menu
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Menu (Slug)</TableHead>
                            <TableHead>Permissões Base</TableHead>
                            {/* Controla a coluna de "Ações" */}
                            {(permissions?.editar || permissions?.excluir) && (
                                <TableHead className="w-[64px] text-right">Ações</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menus.map((menu) => (
                            <TableRow key={menu.idMenuAcesso}>
                                <TableCell>
                                    <div className="font-medium">{menu.nome}</div>
                                    <div className="text-xs text-muted-foreground">{menu.slug}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {menu.visualizar && <Badge variant="outline">Ver</Badge>}
                                        {menu.criar && <Badge variant="outline">Criar</Badge>}
                                        {menu.relatorio && <Badge variant="outline">Relatório</Badge>}
                                        {menu.editar && <Badge variant="outline" className="border-blue-500 text-blue-600">Editar</Badge>}
                                        {menu.excluir && <Badge variant="outline" className="border-red-500 text-red-500">Excluir</Badge>}
                                    </div>
                                </TableCell>
                                {/* Controla a célula de "Ações" */}
                                {(permissions?.editar || permissions?.excluir) && (
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {/* Controla cada item */}
                                                {permissions?.editar && (
                                                    <DropdownMenuItem onClick={() => handleEdit(menu)}>
                                                        Editar Permissões
                                                    </DropdownMenuItem>
                                                )}
                                                {permissions?.excluir && (
                                                    <DropdownMenuItem onClick={() => handleDelete(menu.idMenuAcesso)} className="text-destructive">
                                                        Excluir
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Diálogo */}
            <MenuAcessoDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                menu={editingMenu}
                onDataChanged={fetchData} // Apenas recarrega os menus
            />
        </Card>
    )
}