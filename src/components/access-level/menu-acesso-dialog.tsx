"use client"

import { NivelAcessoCombobox } from "@/components/access-level/nivel-acesso-combobox"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import api from "@/services/api"
import { MenuAcessoComNiveis, NivelAcesso } from "@/types/access-level"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "../ui/label"

// Schema do Zod para o formulário
const menuAcessoSchema = z.object({
    nome: z.string().min(3, "O nome é obrigatório."),
    slug: z.string().min(3, "O slug é obrigatório (ex: 'meu-menu')."),
    visualizar: z.boolean().default(false),
    criar: z.boolean().default(false),
    editar: z.boolean().default(false),
    excluir: z.boolean().default(false),
    relatorio: z.boolean().default(false),
    // O combobox vai gerenciar um array de IDs
    nivelAcessoIds: z.array(z.number()),
})

type MenuAcessoFormValues = z.infer<typeof menuAcessoSchema>

interface MenuAcessoDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    menu: MenuAcessoComNiveis | null
    niveisDisponiveis: NivelAcesso[]
    onDataChanged: () => void // Callback para recarregar dados na página principal
}

export function MenuAcessoDialog({
    isOpen,
    onOpenChange,
    menu,
    niveisDisponiveis,
    onDataChanged,
}: MenuAcessoDialogProps) {

    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<MenuAcessoFormValues>({
        resolver: zodResolver(menuAcessoSchema),
        defaultValues: {
            nome: "",
            slug: "",
            visualizar: true,
            criar: false,
            editar: false,
            excluir: false,
            relatorio: false,
            nivelAcessoIds: [],
        },
    })

    // Popula o formulário ao editar
    React.useEffect(() => {
        if (menu) {
            form.reset({
                ...menu,
                nivelAcessoIds: menu.nivel_acesso.map(n => n.idNivelAcesso)
            })
        } else {
            form.reset({
                nome: "", slug: "",
                visualizar: true, criar: false, editar: false, excluir: false, relatorio: false,
                nivelAcessoIds: [],
            })
        }
    }, [menu, form])

    // Função de submit
    async function onSubmit(data: MenuAcessoFormValues) {
        setIsSubmitting(true)
        try {
            if (menu) {
                // --- 2. Lógica de ATUALIZAÇÃO (PUT) ---
                const response = await api.put(`/admin/acesso/menus/${menu.idMenuAcesso}`, data)
                console.log("Menu ATUALIZADO!", response.data)
            } else {
                // --- 3. Lógica de CRIAÇÃO (POST) ---
                const response = await api.post('/admin/acesso/menus', data)
                console.log("Menu CRIADO!", response.data)
            }
            onDataChanged() // Avisa o pai para recarregar tudo
            onOpenChange(false) // Fecha o diálogo
        } catch (err: any) {
            console.error(err)
            // Usa o 'alert' que estava no seu código original
            alert(err.response?.data?.message || "Erro ao salvar o menu.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{menu ? "Editar" : "Adicionar"} Menu e Permissões</DialogTitle>
                    <DialogDescription>
                        Defina o menu e vincule os níveis de acesso a ele.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* --- CAMPOS DO FORMULÁRIO (sem alteração) --- */}
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Menu</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Gerenciar Usuários" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: gerenciar-usuarios" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <Label>Permissões do Menu</Label> {/* <-- Use <Label> normal */}
                            <p className="text-sm text-muted-foreground"> {/* <-- Use <p> normal */}
                                Defina as ações permitidas para este menu.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                {["visualizar", "criar", "editar", "excluir", "relatorio"].map((key) => (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={key as "visualizar" | "criar" | "editar" | "excluir" | "relatorio"}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                {/* Este FormLabel está CORRETO, pois está dentro de um FormField */}
                                                <FormLabel className="capitalize font-normal text-sm">
                                                    {key}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="nivelAcessoIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vincular Níveis de Acesso</FormLabel>
                                    <FormControl>
                                        <NivelAcessoCombobox
                                            niveisDisponiveis={niveisDisponiveis}
                                            value={field.value} // Array de IDs
                                            onChange={field.onChange} // (value: number[]) => void
                                            onNivelCriado={onDataChanged} // Recarrega a lista de níveis
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Selecione os níveis que terão acesso a este menu.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- FOOTER (sem alteração) --- */}
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Salvar Menu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}