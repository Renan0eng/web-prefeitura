"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/services/api"
import { useEffect, useState } from "react"

export default function AgendamentosTab() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAppointments = async () => {
        try {
            setIsLoading(true)
            const res = await api.get('/appointments')
            setAppointments(res.data || [])
        } catch (err) {
            console.error('Erro ao buscar agendamentos:', err)
            setError('Não foi possível carregar os agendamentos.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Agendamentos</h2>
                <div>
                    <Button variant="outline" size="sm" onClick={fetchAppointments}>Atualizar</Button>
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <Table className="overflow-hidden rounded-lg border">
                <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead>Data / Hora</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white/40">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={`sk-${i}`}>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        appointments.map((a) => (
                            <TableRow key={a.id}>
                                <TableCell>{a.patient?.name || a.patientName || 'Anônimo'}</TableCell>
                                <TableCell>{a.doctor?.name || a.professionalName || '—'}</TableCell>
                                <TableCell>{a.scheduledAt ? new Date(a.scheduledAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</TableCell>
                                <TableCell>
                                    <Badge variant={a.status === 'CONFIRMED' ? 'secondary' : a.status === 'CANCELLED' ? 'destructive' : 'outline'}>
                                        {a.status ?? 'PENDENTE'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button size="sm" variant="ghost">Ver</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                    {appointments.length === 0 && !isLoading && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">Nenhum agendamento encontrado.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
