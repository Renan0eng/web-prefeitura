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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAlert } from "@/hooks/use-alert"
import api from "@/services/api"
import { EnumUserType, NivelAcesso, UserComNivel, UserFormData } from "@/types/access-level"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Schema Zod para o formulário
const userFormSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("Formato de e-mail inválido."),
    // Senha é opcional na edição, mas obrigatória na criação
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres.").optional(),
    passwordConfirmation: z.string().optional(),
    avatar: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    cep: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    // Nível de acesso é string no Select, mas número no envio
    nivelAcessoId: z.string().min(1, "Nível de Acesso é obrigatório."),
    // Tipo é string no Select
    type: z.nativeEnum(EnumUserType),
    active: z.boolean(),
}).refine(data => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"], // Onde mostrar o erro
}).refine(data => {
    // Se não há userToEdit (criação), a senha é obrigatória
    return !!data.password || !!data.passwordConfirmation;
}, {
    message: "A senha é obrigatória ao criar usuário.",
    path: ["password"],
}).refine(data => {
    // Se a senha foi digitada, a confirmação também deve ser
    return !data.password || !!data.passwordConfirmation;
}, {
    message: "Confirmação de senha é obrigatória.",
    path: ["passwordConfirmation"],
});


interface UserFormDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    userToEdit: UserComNivel | null // Usuário para editar (null se for criação)
    niveisAcesso: NivelAcesso[]
    onUserSaved: () => void // Callback para recarregar
}

export function UserFormDialog({
    isOpen,
    onOpenChange,
    userToEdit,
    niveisAcesso,
    onUserSaved,
}: UserFormDialogProps) {

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { setAlert } = useAlert()
    const isEditing = !!userToEdit;

    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            avatar: null,
            cpf: null,
            cep: null,
            phone: null,
            nivelAcessoId: "",
            type: EnumUserType.PACIENTE, // Default
            active: true, // Default
        },
    })

    // Popula o formulário ao editar
    React.useEffect(() => {
        if (userToEdit) {
            form.reset({
                name: userToEdit.name,
                email: userToEdit.email,
                password: "", // Limpa senha na edição
                passwordConfirmation: "",
                avatar: userToEdit.avatar,
                cpf: userToEdit.cpf,
                cep: userToEdit.cep,
                phone: userToEdit.phone,
                nivelAcessoId: String(userToEdit.nivel_acesso.idNivelAcesso), // Converte para string
                type: userToEdit.type,
                active: userToEdit.active,
            });
        } else {
            // Reseta para valores padrão na criação
            form.reset({
                name: "", email: "", password: "", passwordConfirmation: "",
                avatar: null, cpf: null, cep: null, phone: null,
                nivelAcessoId: "", type: EnumUserType.PACIENTE, active: true,
            });
        }
    }, [userToEdit, form, isOpen]); // Roda quando abre/fecha ou userToEdit muda


    // Função de submit
    async function onSubmit(values: z.infer<typeof userFormSchema>) {
        setIsSubmitting(true);

        // Prepara o payload para a API
        const payload: UserFormData = {
            ...values,
            nivelAcessoId: parseInt(values.nivelAcessoId, 10), // Converte ID de volta para número
            // Inclui a senha apenas se foi digitada (e não está editando sem mudar senha)
            ...(!values.password && { password: undefined }),
        };
        // Remove confirmação antes de enviar
        delete payload.passwordConfirmation;


        try {
            if (isEditing) {
                // Rota PUT para UserController
                await api.put(`/admin/users/${userToEdit.idUser}`, payload);
                setAlert("Usuário atualizado com sucesso!", "success");
            } else {
                // Rota POST para UserController
                await api.post('/admin/users', payload);
                setAlert("Usuário criado com sucesso!", "success");
            }
            onUserSaved(); // Chama o callback para fechar e recarregar
        } catch (err: any) {
            console.error("Erro ao salvar usuário:", err);
            setAlert(err.response?.data?.message || "Erro ao salvar usuário.", "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Garante que o form reseta se o diálogo for fechado pelo X ou Esc
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset(); // Limpa o form ao fechar
        }
        onOpenChange(open);
    }


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? `Editando informações de ${userToEdit?.name}.` : "Preencha os dados do novo usuário."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Campos do Formulário */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do usuário" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail*</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Senha e Confirmação */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha{isEditing ? ' (Opcional)' : '*'}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={isEditing ? 'Deixe em branco para não alterar' : '******'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Senha{isEditing ? ' (Opcional)' : '*'}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Nível de Acesso e Tipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nivelAcessoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nível de Acesso*</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {niveisAcesso.map(nivel => (
                                                    <SelectItem key={nivel.idNivelAcesso} value={String(nivel.idNivelAcesso)}>
                                                        {nivel.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Usuário*</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {/* Use Object.values ou uma lista manual dos seus EnumUserType */}
                                                {Object.values(EnumUserType).map(typeValue => (
                                                    <SelectItem key={typeValue} value={typeValue}>
                                                        {typeValue} {/* Pode querer formatar o nome aqui */}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Status Ativo */}
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Status</FormLabel>
                                        <FormDescription>
                                            Permite que o usuário faça login no sistema.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
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
                                {isEditing ? "Salvar Alterações" : "Criar Usuário"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}