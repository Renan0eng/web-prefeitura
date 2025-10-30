'use client';

import api from '@/services/api';
import {
    AlertTriangle,
    Edit,
    Eye,
    List,
    MoreVertical,
    Plus,
    Trash2,
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
    id: string;
    title: string;
    description: string | null;
    updatedAt: string;
};

export default function FormListPage() {
    const [forms, setForms] = useState<FormListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // AJUSTE ESTE CAMINHO se o seu 'formBuilder' não estiver em /admin/ferramentas
    const basePath = '/admin/ferramentas/formBuilder';

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
                    <Card key={form.id}>
                        {/* Usamos flex-row, items-center e space-y-0
                        para alinhar o título e o botão de menu 
                        */}
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1.5">
                                <CardTitle>{form.title}</CardTitle>
                                <CardDescription className="truncate max-w-lg">
                                    {form.description || 'Sem descrição'}
                                </CardDescription>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className='hover:text-white rounded-full'>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {/* A prop `asChild` permite que o `Link`
                                    receba toda a estilização e comportamento
                                    do `DropdownMenuItem`.
                                    */}
                                    <DropdownMenuItem asChild>
                                        <Link href={`${basePath}/${form.id}`} className="cursor-pointer">
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editar Formulário</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`${basePath}/${form.id}/respostas`} className="cursor-pointer">
                                            <List className="mr-2 h-4 w-4" />
                                            <span>Ver Respostas</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/forms/${form.id}`} target="_blank" className="cursor-pointer">
                                            <Eye className="mr-2 h-4 w-4" />
                                            <span>Visualizar (Público)</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="text-primary hover:bg-primary hover:text-white cursor-pointer"
                                        onSelect={() => handleDelete(form.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Excluir</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>

                        <CardFooter>
                            <p className="text-sm text-muted-foreground">
                                Atualizado em: {new Date(form.updatedAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: '2-digit', year: 'numeric'
                                })}
                            </p>
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