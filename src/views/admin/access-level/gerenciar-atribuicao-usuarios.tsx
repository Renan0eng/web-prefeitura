"use client"
// src/views/admin/access-level/gerenciar-atribuicao-usuarios.tsx

import { UsuarioNivelDialog } from "@/components/access-level/usuario-nivel-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAlert } from "@/hooks/use-alert"
import api from "@/services/api"
import { NivelAcesso, UserComNivel } from "@/types/access-level"
import { Edit, Loader2 } from "lucide-react"
import * as React from "react"

export function GerenciarAtribuicaoUsuarios() {
    const [users, setUsers] = React.useState<UserComNivel[]>([])
    const [niveisDisponiveis, setNiveisDisponiveis] = React.useState<NivelAcesso[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingUser, setEditingUser] = React.useState<UserComNivel | null>(null)

    const { setAlert } = useAlert()

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [usersResponse, niveisResponse] = await Promise.all([
                api.get('/admin/acesso/users'),
                api.get('/admin/acesso/niveis'),
            ])
            setUsers(usersResponse.data)
            setNiveisDisponiveis(niveisResponse.data)
        } catch (err: any) {
            setAlert(err.response?.data?.message || "Erro ao carregar dados.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (user: UserComNivel) => {
        setEditingUser(user)
        setIsDialogOpen(true)
    }

    const onDataChanged = () => {
        fetchData() // Re-busca os dados após a atualização
        setIsDialogOpen(false) // Fecha o diálogo
    }

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Atribuição de Usuários</CardTitle>
                    <CardDescription>
                        Atribua um nível de acesso para cada usuário do sistema.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />}
                {!isLoading && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Nível de Acesso</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[64px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.idUser}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.nivel_acesso.nome === 'Administrador' ? 'default' : 'secondary'}>
                                            {user.nivel_acesso.nome}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.active ? (
                                            <Badge variant="outline" className="border-green-500 text-green-600">Ativo</Badge>
                                        ) : (
                                            <Badge variant="destructive">Inativo</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* Diálogo para editar o nível do usuário */}
            {editingUser && (
                <UsuarioNivelDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    user={editingUser}
                    niveisDisponiveis={niveisDisponiveis}
                    onDataChanged={onDataChanged}
                />
            )}
        </Card>
    )
}