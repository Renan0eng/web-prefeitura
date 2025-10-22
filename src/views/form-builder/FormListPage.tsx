'use client';

import api from '@/services/api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
                // 1. Chama a nova rota GET /forms
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

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meus Formulários</h1>

                {/* 2. Link para a nova página de criação */}
                <Link
                    href={basePath}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
                >
                    <Plus size={18} />
                    Criar Novo Formulário
                </Link>
            </div>

            {isLoading && <p>Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && (
                <div className="space-y-4">
                    {forms.length === 0 ? (
                        <div className="text-center p-10 bg-background-foreground rounded-lg border">
                            <p className="text-gray-500">Nenhum formulário criado ainda.</p>
                        </div>
                    ) : (
                        // 3. Lista os formulários
                        forms.map(form => (
                            <Link
                                key={form.id}
                                // Link para a página de edição [formId]
                                href={`${basePath}/${form.id}`}
                                className="block bg-background-foreground p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
                            >
                                <h2 className="text-xl font-semibold text-primary">{form.title}</h2>
                                <p className="text-gray-600 mt-2 truncate">
                                    {form.description || 'Sem descrição'}
                                </p>
                                <p className="text-sm text-gray-400 mt-4">
                                    Atualizado em: {new Date(form.updatedAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}