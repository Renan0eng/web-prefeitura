"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/services/api"
import { Eye, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function EsteiraPacientesTab() {
    const [formsResponses, setFormsResponses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [visibleColumnsEsteira, setVisibleColumnsEsteira] = useState({
        form: true,
        paciente: true,
        dataEnvio: true,
        pontuacao: true,
    })

    const fetchResponses = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/forms/responses/list")
            setFormsResponses(res.data || [])
        } catch (err) {
            console.error("Erro ao buscar respostas:", err)
            setError("Não foi possível carregar as respostas.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchResponses()
    }, [])

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Esteira de Pacientes</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">Colunas</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {Object.keys(visibleColumnsEsteira).map((key) => (
                            <DropdownMenuCheckboxItem
                                key={key}
                                checked={visibleColumnsEsteira[key as keyof typeof visibleColumnsEsteira]}
                                onCheckedChange={(checked) =>
                                    setVisibleColumnsEsteira((prev) => ({
                                        ...prev,
                                        [key]: checked,
                                    }))
                                }
                            >
                                {key === "form" && "Formulário"}
                                {key === "paciente" && "Paciente"}
                                {key === "dataEnvio" && "Data de Envio"}
                                {key === "pontuacao" && "Pontuação Total"}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {isLoading ? (
                <p>Carregando...</p>
            ) : (
                <Table className="overflow-hidden rounded-lg border">
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        <TableRow>
                            {visibleColumnsEsteira.form && <TableHead>Formulário</TableHead>}
                            {visibleColumnsEsteira.paciente && <TableHead>Paciente</TableHead>}
                            {visibleColumnsEsteira.dataEnvio && <TableHead>Data de Envio</TableHead>}
                            {visibleColumnsEsteira.pontuacao && <TableHead>Pontuação Total</TableHead>}
                            <TableHead className="max-w-12 text-center">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white/40">
                        {formsResponses.map((response) => (
                            <TableRow key={response.idResponse}>
                                {visibleColumnsEsteira.form && (
                                    <TableCell title={response.form?.title || "Sem título"}>
                                        {response.form?.title || "Sem título"}
                                    </TableCell>
                                )}
                                {visibleColumnsEsteira.paciente && (
                                    <TableCell title={response.user?.name || "Anônimo"}>
                                        {response.user?.name || "Anônimo"}
                                    </TableCell>
                                )}
                                {visibleColumnsEsteira.dataEnvio && (
                                    <TableCell>
                                        {new Date(response.submittedAt).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TableCell>
                                )}
                                {visibleColumnsEsteira.pontuacao && (
                                    <TableCell>
                                        <Badge className="items-center">Score: {response.totalScore ?? 0}</Badge>
                                    </TableCell>
                                )}
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
                                                <Link
                                                    href={`/admin/criar-formulario/${response.form?.idForm}/respostas/${response.idResponse}`}
                                                    className="cursor-pointer"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    <span>Visualizar Resposta</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    )
}
