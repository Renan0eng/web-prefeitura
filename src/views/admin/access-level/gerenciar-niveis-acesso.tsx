"use client"

import { NivelAcessoDialog } from "@/components/access-level/nivel-acesso-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAlert } from "@/hooks/use-alert"; // Seu hook de alerta
import api from "@/services/api"; // Sua API
import { MenuAcesso, NivelAcesso } from "@/types/access-level"; // Tipos do frontend
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Níveis de Acesso</CardTitle>
          <CardDescription>
            Crie os níveis (cargos) e gerencie quais menus eles podem acessar.
          </CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Nível
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />}
        {!isLoading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Menus Vinculados</TableHead>
                <TableHead className="w-[64px] text-right">Ações</TableHead>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleManageMenus(nivel)}>
                          Gerenciar Menus
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(nivel)}>
                          Editar Nível
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(nivel.idNivelAcesso)} className="text-destructive">
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

      {/* Diálogo para Criar/Editar o Nível (nome, descrição) */}
      <NivelAcessoDialog
        isOpen={isNivelDialogOpen}
        onOpenChange={setIsNivelDialogOpen}
        nivel={editingNivel}
        onDataChanged={onDataChanged}
      />

      {/* Diálogo para Gerenciar Menus (vincular/desvincular) */}
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