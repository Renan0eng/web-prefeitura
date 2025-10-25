"use client"

import { MenuAcessoDialog } from "@/components/access-level/menu-acesso-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MenuAcessoComNiveis, NivelAcesso } from "@/types/access-level"; // Importa os tipos que criamos
import { Loader2, MoreHorizontal, PlusCircle } from "lucide-react"
import * as React from "react"
// import { deleteMenu, getMenus, getNiveis } from "@/lib/api-client" // Importa da API

export function GerenciarMenusAcesso() {
    const [menus, setMenus] = React.useState<MenuAcessoComNiveis[]>([])
    const [niveis, setNiveis] = React.useState<NivelAcesso[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingMenu, setEditingMenu] = React.useState<MenuAcessoComNiveis | null>(null)

    // Função para buscar todos os dados (menus e níveis)
    const fetchData = async () => {
        try {
            setIsLoading(true)
            // const [menusData, niveisData] = await Promise.all([
            //     getMenus(),
            //     getNiveis(),
            // ])
            // setMenus(menusData)
            // setNiveis(niveisData)
            setError(null)
        } catch (err) {
            console.error(err)
            setError("Falha ao carregar dados.")
        } finally {
            setIsLoading(false)
        }
    }

    // Buscar dados no mount
    React.useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (menu: MenuAcessoComNiveis) => {
        setEditingMenu(menu)
        setIsDialogOpen(true)
    }

    const handleAddNew = () => {
        setEditingMenu(null)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir este menu?")) {
            try {
                // await deleteMenu(id)
                fetchData() // Re-busca os dados
            } catch (err: any) {
                console.error(err)
                alert(`Erro ao excluir: ${err.message}`)
            }
        }
    }

    // Callback para quando um nível é criado no componente filho
    const onDataChanged = () => {
        fetchData()
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Menus e Permissões</CardTitle>
                    <CardDescription>
                        Crie menus e defina quais níveis podem acessá-los.
                    </CardDescription>
                </div>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Novo Menu
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {!isLoading && !error && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Menu (Slug)</TableHead>
                                <TableHead>Permissões</TableHead>
                                <TableHead>Níveis de Acesso Vinculados</TableHead>
                                <TableHead className="w-[64px] text-right">Ações</TableHead>
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
                                            {menu.editar && <Badge variant="outline">Editar</Badge>}
                                            {menu.excluir && <Badge variant="outline" className="border-red-500 text-red-500">Excluir</Badge>}
                                            {menu.relatorio && <Badge variant="outline" className="border-blue-500 text-blue-600">Relatório</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {menu.nivel_acesso.map(n => <Badge key={n.idNivelAcesso} variant="secondary">{n.nome}</Badge>)}
                                            {menu.nivel_acesso.length === 0 && <span className="text-xs text-muted-foreground">Nenhum</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(menu)}>
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(menu.idMenuAcesso)} className="text-destructive">
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* O Diálogo de Criação/Edição */}
            <MenuAcessoDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                menu={editingMenu}
                niveisDisponiveis={niveis}
                onDataChanged={onDataChanged} // Passa o callback para recarregar
            />
        </Card>
    )
}