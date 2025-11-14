"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAlert } from "@/hooks/use-alert"
import api from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const agendamentoSchema = z.object({
    doctorId: z.string().min(1, "Selecione um médico."),
    scheduledAt: z.string().min(1, "Informe data e hora."),
    notes: z.string().optional(),
})
type AgendamentoFormValues = z.infer<typeof agendamentoSchema>

interface AgendarConsultaDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    response: any // response object from EsteiraPacientesTab
    onScheduled?: () => void
}

export default function AgendarConsultaDialog({ isOpen, onOpenChange, response, onScheduled }: AgendarConsultaDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [doctors, setDoctors] = React.useState<any[]>([])
    const [loadingDoctors, setLoadingDoctors] = React.useState(false)
    const { setAlert } = useAlert()

    const form = useForm<AgendamentoFormValues>({
        resolver: zodResolver(agendamentoSchema),
        defaultValues: { doctorId: "", scheduledAt: "", notes: "" },
    })

    React.useEffect(() => {
        if (!isOpen) return
        const fetchDoctors = async () => {
            try {
                setLoadingDoctors(true)
                // endpoint returns users with access level info; filter by type 'USUARIO' (medicos)
                const res = await api.get('/admin/acesso/users')
                const list = res.data || []
                const filtered = list.filter((u: any) => u.type === 'USUARIO')
                setDoctors(filtered)
            } catch (err) {
                console.error('Erro ao buscar médicos:', err)
                setAlert('Não foi possível carregar lista de médicos.', 'error')
            } finally {
                setLoadingDoctors(false)
            }
        }
        fetchDoctors()
    }, [isOpen, setAlert])

    React.useEffect(() => {
        // if dialog opened for a response, prefill patient and reset on close
        if (!isOpen) form.reset()
    }, [isOpen, form])

    const handleOpenChange = (open: boolean) => {
        if (!open) form.reset()
        onOpenChange(open)
    }

    async function onSubmit(data: AgendamentoFormValues) {
        setIsSubmitting(true)
        try {
            const payload = {
                doctorId: data.doctorId,
                patientId: response?.user?.idUser || null,
                responseId: response?.idResponse,
                scheduledAt: data.scheduledAt,
                notes: data.notes || '',
            }

            // backend endpoint may vary; using /appointments as a reasonable default
            await api.post('/appointments', payload)
            setAlert('Consulta agendada com sucesso!', 'success')
            if (onScheduled) onScheduled()
            handleOpenChange(false)
        } catch (err: any) {
            console.error('Erro ao agendar consulta:', err)
            setAlert(err.response?.data?.message || 'Erro ao agendar consulta.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agendar Consulta</DialogTitle>
                    <DialogDescription>
                        Crie um agendamento de consulta para o paciente relacionado à resposta selecionada.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="doctorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profissional*</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingDoctors ? 'Carregando...' : 'Selecione um profissional'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.length === 0 && !loadingDoctors && (
                                                    // Radix Select requires non-empty value on items. Use a sentinel value and disable the item.
                                                    <SelectItem value="__no_doctor" disabled>Nenhum profissional disponível</SelectItem>
                                                )}
                                                {doctors?.map((d: any) => (
                                                    <SelectItem key={d.idUser} value={d.idUser}>{d.name} - {d.email}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="scheduledAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data e Hora*</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Motivo / observações (opcional)" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Agendar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
