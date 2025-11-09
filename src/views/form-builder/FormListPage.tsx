'use client';

import api from '@/services/api';
import {
    AlertTriangle,
    CalendarDays,
    Edit,
    List,
    ListChecks,
    MoreVertical,
    Plus,
    Trash2,
    UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// shadcn/ui components
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

// Tipo para os dados que esperamos do back-end (GET /forms)
type FormListItem = {
    idForm: string;
    title: string;
    description: string | null;
    updatedAt: string;
    responses: number;
};

export default function FormListPage() {
    const [forms, setForms] = useState<FormListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const basePath = '/admin/criar-formulario';

    useEffect(() => {
        const fetchForms = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/forms');
                setForms(response.data);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar formulários:", err);
                setError("Não foi possível carregar os formulários.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchForms();
    }, []); // Roda apenas uma vez ao montar o componente

    // Placeholder para a função de excluir
    const handleDelete = (formId: string) => {
        // Impede que o menu se feche imediatamente (embora o DropdownMenu lide bem com isso)
        // e.stopPropagation(); 

        if (confirm(`Tem certeza que deseja excluir o formulário ${formId}?`)) {
            // Lógica real:
            // try {
            //   await api.delete(`/forms/${formId}`);
            //   setForms(forms.filter(f => f.id !== formId));
            // } catch (err) { ... }
        }
    };

    // Componente de Skeleton para o loading
    const renderSkeletons = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
    );

    // Renderização principal
    const renderContent = () => {
        if (isLoading) {
            return renderSkeletons();
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (forms.length === 0) {
            return (
                <Card>
                    <CardContent className="p-10 text-center">
                        <p className="text-muted-foreground">
                            Nenhum formulário criado ainda.
                        </p>
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-4">
                {forms.map(form => (
                    <Card key={form.idForm}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1.5">
                                {/* 1. Corrigido para text-primary semântico */}
                                <CardTitle className='text-primary'>{form.title}</CardTitle>
                                <CardDescription className="truncate max-w-lg">
                                    {form.description || 'Sem descrição'}
                                </CardDescription>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    {/* 2. Removido hover:text-white que conflitava com 'ghost' */}
                                    <Button variant="ghost" size="icon" className='rounded-full'>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={`${basePath}/${form.idForm}`} className="cursor-pointer">
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editar Formulário</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`${basePath}/${form.idForm}/respostas`} className="cursor-pointer">
                                            <ListChecks className="mr-2 h-4 w-4" />
                                            <span>Ver Respostas</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/responder-formulario/${form.idForm}`} className="cursor-pointer">
                                            <List className="mr-2 h-4 w-4" />
                                            <span>Responder Formulário</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/admin/atribuir-usuarios/${form.idForm}`}
                                            className="cursor-pointer"
                                        >
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            <span>Atribuir Usuários</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    {/* 3. Corrigido para "destructive" semântico */}
                                    <DropdownMenuItem
                                        className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                                        onSelect={() => handleDelete(form.idForm)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Excluir</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>

                        {/* 4. Footer melhorado com ícones, flex e melhor texto */}
                        <CardFooter className='flex justify-between text-sm text-muted-foreground'>
                            <div className="flex items-center">
                                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                                <span>
                                    {new Date(form.updatedAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <ListChecks className="mr-1.5 h-3.5 w-3.5" />
                                <span>
                                    {form.responses} {form.responses === 1 ? 'Resposta' : 'Respostas'}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meus Formulários</h1>

                <Link href={basePath}>
                    <Button className='text-white'>
                        <Plus size={18} className="mr-2" />
                        Criar Novo Formulário
                    </Button>
                </Link>
            </div>

            {renderContent()}
        </div>
    );
}