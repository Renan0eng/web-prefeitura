'use client';

import BtnVoltar from '@/components/buttons/btn-voltar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import api from '@/services/api';
import { FormResponseSummary, FormWithResponses } from '@/types/form-builder';
import { ChevronRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface ResponseListPageProps {
    formId: string;
}

export const ResponseListPage = ({ formId }: ResponseListPageProps) => {
    const router = useRouter();
    const { getPermissions, loading: authLoading } = useAuth();
    const permissions = useMemo(() => getPermissions('respostas'), [getPermissions]);
    const [data, setData] = useState<FormWithResponses | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<FormWithResponses>(`/forms/${formId}/responses`);
                setData(response.data);
            } catch (error) {
                console.error("Falha ao carregar respostas:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (permissions?.visualizar) {
            fetchResponses();
        }
    }, [formId, permissions?.visualizar]);

    if (authLoading) {
        return <div className="p-8">Carregando...</div>;
    }

    if (!permissions?.visualizar) {
        return <div className="p-8">Você não tem permissão para visualizar respostas.</div>;
    }

    if (isLoading) {
        return <div className="p-8">Carregando respostas...</div>;
    }

    if (!data) {
        return <div className="p-8">Não foi possível carregar os dados.</div>;
    }

    const { title, responses } = data;

    return (
        <div className="max-w-4xl mx-auto px-2 sm:px-8 relative xxl:pt-0 pt-12">
            <BtnVoltar/>
            <div>
                <div className="flex flex-wrap items-center">
                <h1 className="text-3xl font-bold pr-2">Respostas de:</h1>
                <h1 className="text-2xl">{title}</h1>
                </div>

                <p className="text-gray-600 mb-6">{responses.length} resposta(s) no total</p>
                <div className="bg-background-foreground rounded-lg shadow-md border">
                    {responses.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">Nenhuma resposta recebida ainda.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {responses.map((response: FormResponseSummary) => (
                                <li
                                    key={response.idResponse}
                                    onClick={() => router.push(`/admin/criar-formulario/${formId}/respostas/${response.idResponse}`)}
                                    className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-full">
                                            <User size={18} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {response.user ? response.user.name : 'Respondente Anônimo'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Enviado em: {new Date(response.submittedAt).toLocaleString('pt-BR')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 text-gray-700'>
                                        <Badge className=" hover:text-white w-fit min-w-20 items-center justify-center flex">
                                            Score: {response.totalScore}
                                        </Badge>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};