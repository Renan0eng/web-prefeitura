'use client';

import api from '@/services/api';
import { FormResponseDetail, ResponseAnswerDetail } from '@/types/form-builder';
import { Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResponseDetailPageProps {
    responseId: string;
}

export const ResponseDetailPage = ({ responseId }: ResponseDetailPageProps) => {
    const [response, setResponse] = useState<FormResponseDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResponseDetail = async () => {
            try {
                setIsLoading(true);
                const res = await api.get<FormResponseDetail>(`/forms/response/${responseId}`);
                setResponse(res.data);
            } catch (error) {
                console.error("Falha ao carregar detalhes da resposta:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResponseDetail();
    }, [responseId]);

    if (isLoading) {
        return <div className="p-8">Carregando detalhes da resposta...</div>;
    }

    if (!response) {
        return <div className="p-8">Não foi possível carregar os dados.</div>;
    }

    // Função auxiliar para renderizar a resposta
    const renderAnswer = (answer: ResponseAnswerDetail) => {

        // --- CORREÇÃO AQUI ---
        // Verificamos o 'type' dentro de 'answer.question'
        if (answer.question.type === 'CHECKBOXES') {
            if (answer.values.length === 0) {
                return <p className="text-gray-500 italic">Nenhuma opção selecionada.</p>;
            }
            return (
                <ul className="list-disc list-inside">
                    {answer.values.map((val, idx) => (
                        <li key={idx} className="text-gray-800">{val}</li>
                    ))}
                </ul>
            );
        }

        // Para SHORT_TEXT, PARAGRAPH, MULTIPLE_CHOICE
        return <p className="text-gray-800">{answer.value || <span className="italic text-gray-500">Não respondido</span>}</p>;
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            {/* Cabeçalho */}
            <div className="bg-background-foreground p-6 rounded-lg shadow-md border-t-8 border-primary mb-6">
                <h1 className="text-3xl mb-2">{response.form.title}</h1>
                <p className="text-gray-600">Detalhes da Resposta</p>
                <div className="mt-4 border-t pt-4 flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{response.user ? `${response.user.name} (${response.user.email})` : 'Respondente Anônimo'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Enviado em: {new Date(response.submittedAt).toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>

            {/* Respostas */}
            <div className="space-y-4">
                {response.answers.map((answer) => (
                    <div key={answer.id} className="bg-background-foreground p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {answer.question.text}
                        </h3>
                        <div className="prose prose-sm max-w-none">
                            {renderAnswer(answer)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};