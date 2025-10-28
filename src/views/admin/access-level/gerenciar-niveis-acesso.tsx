"use client"

import { NivelAcessoDialog } from "@/components/access-level/nivel-acesso-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAlert } from "@/hooks/use-alert"
import { useAuth } from "@/hooks/use-auth"; // Importa o useAuth
import api from "@/services/api"
import { MenuAcesso, NivelAcesso } from "@/types/access-level"
import { Loader2, MoreHorizontal, PlusCircle } from "lucide-react"
import * as React from "react"
import { GerenciarMenusNivelDialog } from "../../../components/access-level/gerenciar-menus-nivel-dialog"

// Tipo para NivelAcesso COM os menus
type NivelAcessoComMenus = NivelAcesso & { menus: MenuAcesso[] }

export function GerenciarNiveisAcesso() {
  const [niveis, setNiveis] = React.useState<NivelAcessoComMenus[]>([])
  const [todosMenus, setTodosMenus] = React.useState<MenuAcesso[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isNivelDialogOpen, setIsNivelDialogOpen] = React.useState(false)
  const [isMenuDialogOpen, setIsMenuDialogOpen] = React.useState(false)
  const [editingNivel, setEditingNivel] = React.useState<NivelAcessoComMenus | null>(null)

  const { setAlert } = useAlert()
  const { getPermissions } = useAuth() // Pega a função de permissão

  // Define o slug desta tela e busca as permissões
  // (Assumindo "acesso" para a página inteira)
  const permissions = React.useMemo(
    () => getPermissions("acesso"),
    [getPermissions]
  )

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // Buscamos os níveis (com seus menus) e TODOS os menus disponíveis
      const [niveisResponse, menusResponse] = await Promise.all([
        api.get('/admin/acesso/niveis'),
        api.get('/admin/acesso/menus')
      ])
      setNiveis(niveisResponse.data)
      setTodosMenus(menusResponse.data)
    } catch (err: any) {
      setAlert(err.response?.data?.message || "Erro ao carregar dados.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const handleAddNew = () => {
    setEditingNivel(null)
    setIsNivelDialogOpen(true)
  }

  const handleEdit = (nivel: NivelAcessoComMenus) => {
    setEditingNivel(nivel)
    setIsNivelDialogOpen(true)
  }

  const handleManageMenus = (nivel: NivelAcessoComMenus) => {
    setEditingNivel(nivel)
    setIsMenuDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este nível?")) return
    try {
      await api.delete(`/admin/acesso/niveis/${id}`)
      setAlert("Nível excluído com sucesso!", "success")
      fetchData()
    } catch (err: any) {
      setAlert(err.response?.data?.message || "Erro ao excluir nível.", "error")
    }
  }

  const onDataChanged = () => {
    fetchData()
    setIsNivelDialogOpen(false)
    setIsMenuDialogOpen(false)
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
          <CardTitle>Níveis de Acesso</CardTitle>
          <CardDescription>
            Crie os níveis (cargos) e gerencie quais menus eles podem acessar.
          </CardDescription>
        </div>
        {/* Controla o botão "Novo" */}
        {permissions?.criar && (
          <Button onClick={handleAddNew}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Nível
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Menus Vinculados</TableHead>
              {/* Controla a coluna de "Ações" */}
              {(permissions?.editar || permissions?.excluir) && (
                <TableHead className="w-[64px] text-right">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {niveis.map((nivel) => (
              <TableRow key={nivel.idNivelAcesso}>
                <TableCell>
                  <div className="font-medium">{nivel.nome}</div>
                  <div className="text-xs text-muted-foreground">{nivel.descricao}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {nivel.menus?.length === 0 && <span className="text-xs text-muted-foreground">Nenhum</span>}
                    {nivel.menus?.map(menu => (
                      <Badge key={menu.idMenuAcesso} variant="secondary">{menu.nome}</Badge>
                    ))}
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
                        {/* Controla cada item do menu */}
                        {permissions?.editar && (
                          <DropdownMenuItem onClick={() => handleManageMenus(nivel)}>
                            Gerenciar Menus
                          </DropdownMenuItem>
                        )}
                        {permissions?.editar && (
                          <DropdownMenuItem onClick={() => handleEdit(nivel)}>
                            Editar Nível
                          </DropdownMenuItem>
                        )}
                        {permissions?.excluir && (
                          <DropdownMenuItem onClick={() => handleDelete(nivel.idNivelAcesso)} className="text-destructive">
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

      {/* Diálogos */}
      <NivelAcessoDialog
        isOpen={isNivelDialogOpen}
        onOpenChange={setIsNivelDialogOpen}
        nivel={editingNivel}
        onDataChanged={onDataChanged}
      />
      {editingNivel && (
        <GerenciarMenusNivelDialog
          isOpen={isMenuDialogOpen}
          onOpenChange={setIsMenuDialogOpen}
          nivel={editingNivel}
          todosMenus={todosMenus}
          onDataChanged={onDataChanged}
        />
      )}
    </Card>
  )
}