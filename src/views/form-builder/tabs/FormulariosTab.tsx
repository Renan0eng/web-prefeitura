"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/services/api"
import { Edit, List, ListChecks, MoreVertical, Plus, Settings2, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function FormulariosTab() {
    const [forms, setForms] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    const [columns, setColumns] = useState({
        title: true,
        description: true,
        updatedAt: true,
        responses: true,
        actions: true
    })

    const fetchForms = async () => {
        try {
            setIsLoading(true)
            const response = await api.get(`/forms?page=${page}&limit=${limit}`)
            setForms(response.data.forms || response.data)
            setTotalPages(response.data.totalPages || 1)
            setError(null)
        } catch (err) {
            console.error("Erro ao buscar formulários:", err)
            setError("Não foi possível carregar os formulários.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/forms/${id}`)
            fetchForms()
        } catch (err) {
            console.error("Erro ao excluir:", err)
        }
    }

    useEffect(() => {
        fetchForms()
    }, [page])

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Meus Formulários</h2>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings2 className="h-4 w-4 mr-2" />
                                Colunas
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="p-2">
                            {Object.entries(columns).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between px-2 py-1">
                                    <span className="capitalize">{key}</span>
                                    <Switch
                                        checked={value}
                                        onCheckedChange={() =>
                                            setColumns((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
                                        }
                                    />
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href={"/admin/criar-formulario"} className="ml-4">
                        <Button className="text-white">
                            <Plus size={18} className="mr-2" />
                            Criar Novo Formulário
                        </Button>
                    </Link>
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {isLoading ? (
                <p>Carregando...</p>
            ) : (
                <Table className="overflow-hidden rounded-lg border">
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        <TableRow>
                            {columns.title && <TableHead>Título</TableHead>}
                            {columns.description && <TableHead>Descrição</TableHead>}
                            {columns.updatedAt && <TableHead>Atualizado em</TableHead>}
                            {columns.responses && <TableHead>Respostas</TableHead>}
                            {columns.actions && <TableHead className="max-w-8">Ações</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white/40">
                        {forms.map((form) => (
                            <TableRow key={form.idForm}>
                                {columns.title && <TableCell>{form.title}</TableCell>}
                                {columns.description && (
                                    <TableCell className="max-w-[300px] truncate">{form.description}</TableCell>
                                )}
                                {columns.updatedAt && (
                                    <TableCell>
                                        {new Date(form.updatedAt).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </TableCell>
                                )}
                                {columns.responses && (
                                    <TableCell>
                                        <Link href={`/admin/criar-formulario/${form.idForm}/respostas`}>
                                            <Badge className="items-center">
                                                <ListChecks className="mr-1.5 h-3.5 w-3.5" />
                                                <span>
                                                    {form.responses} {form.responses === 1 ? "Resposta" : "Respostas"}
                                                </span>
                                            </Badge>
                                        </Link>
                                    </TableCell>
                                )}
                                {columns.actions && (
                                    <TableCell className="text-center p-0 justify-center items-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/criar-formulario/${form.idForm}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar Formulário
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/responder-formulario/${form.idForm}`}>
                                                        <List className="mr-2 h-4 w-4" />
                                                        Responder Formulário
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/atribuir-usuarios/${form.idForm}`}>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        Atribuir Usuários
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                                                    onSelect={() => handleDelete(form.idForm)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <div className="flex justify-end items-center mt-4 space-x-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Anterior
                </Button>
                <span>
                    Página {page} de {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Próxima
                </Button>
            </div>
        </>
    )
}
