"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import api from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Schema do Zod para o formulário
const nivelAcessoSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    descricao: z.string().optional(),
})

type NivelAcessoFormValues = z.infer<typeof nivelAcessoSchema>

interface NivelAcessoDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onNivelCriado: () => void // Callback para recarregar dados
}

export function NivelAcessoDialog({ isOpen, onOpenChange, onNivelCriado }: NivelAcessoDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<NivelAcessoFormValues>({
        resolver: zodResolver(nivelAcessoSchema),
        defaultValues: { nome: "", descricao: "" },
    })

    // Função de submit
    async function onSubmit(data: NivelAcessoFormValues) {
        setIsSubmitting(true)
        try {
            // --- 2. Lógica de CRIAÇÃO (POST) ---
            const response = await api.post('/admin/acesso/niveis', data)
            console.log("Nível CRIADO!", response.data)
            
            onNivelCriado() // Avisa o componente pai que um novo nível foi criado
            onOpenChange(false) // Fecha o diálogo
            form.reset() // Limpa o formulário
        } catch (err: any) {
            console.error(err)
            // Usa o 'alert' que estava no seu código original
            alert(err.response?.data?.message || "Erro ao criar nível.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Garante que o form reseta se o diálogo for fechado
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset()
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Novo Nível de Acesso</DialogTitle>
                    <DialogDescription>
                        Defina um nome e descrição para o novo nível.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* --- CAMPOS DO FORMULÁRIO (sem alteração) --- */}
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Administrador" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Ex: Permite gerenciar usuários e configurações." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* --- FOOTER (sem alteração) --- */}
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}