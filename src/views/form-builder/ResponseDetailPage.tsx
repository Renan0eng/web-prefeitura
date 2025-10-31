'use client';

import api from '@/services/api';
// Seus tipos precisam ter 'score' em ResponseAnswerDetail e 'totalScore' em FormResponseDetail
import { FormResponseDetail, ResponseAnswerDetail } from '@/types/form-builder';
// Importe 'useMemo' para o cálculo e 'Loader2' e 'Calculator' para os ícones
import { Calculator, Calendar, Loader2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResponseDetailPageProps {
    responseId: string;
}

// O tipo FormResponseDetail do backend agora deve incluir 'totalScore'
type ApiResponse = FormResponseDetail & { totalScore: number };

export const ResponseDetailPage = ({ responseId }: ResponseDetailPageProps) => {
    // Ajuste o estado para incluir o totalScore
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResponseDetail = async () => {
            try {
                setIsLoading(true);
                // O 'get' agora espera a resposta com 'totalScore'
                const res = await api.get<ApiResponse>(`/forms/response/${responseId}`);
                console.log("res: ", res);
                
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
        return (
            <div className="p-8 flex justify-center items-center min-h-[300px]">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Carregando detalhes da resposta...
            </div>
        );
    }

    if (!response) {
        return <div className="p-8 text-destructive">Não foi possível carregar os dados.</div>;
    }

    // Função auxiliar para renderizar a resposta (com classes shadcn)
    const renderAnswer = (answer: ResponseAnswerDetail) => {
        if (answer.question.type === 'CHECKBOXES') {
            if (answer.values.length === 0) {
                return <p className="text-muted-foreground italic">Nenhuma opção selecionada.</p>;
            }
            return (
                <ul className="list-disc list-inside">
                    {answer.values.map((val, idx) => (
                        <li key={idx} className="text-foreground">{val}</li>
                    ))}
                </ul>
            );
        }

        // Para SHORT_TEXT, PARAGRAPH, MULTIPLE_CHOICE
        return <p className="text-foreground">{answer.value || <span className="italic text-muted-foreground">Não respondido</span>}</p>;
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            {/* Cabeçalho (com classes shadcn) */}
            <div className="bg-card p-6 rounded-lg shadow-md border-t-8 border-primary mb-6">
                <h1 className="text-3xl mb-2">{response.form.title}</h1>
                <p className="text-muted-foreground">Detalhes da Resposta</p>
                <div className="mt-4 border-t pt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{response.user ? `${response.user.name} (${response.user.email})` : 'Respondente Anônimo'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Enviado em: {new Date(response.submittedAt).toLocaleString('pt-BR')}</span>
                    </div>

                    {/* 1. EXIBIÇÃO DA PONTUAÇÃO TOTAL */}
                    {/* Exibe o totalScore que veio do backend */}
                    <div className="flex items-center gap-2 text-primary font-semibold text-base mt-2">
                        <Calculator size={16} />
                        <span>Pontuação Total: {response.totalScore}</span>
                    </div>

                </div>
            </div>

            {/* Respostas */}
            <div className="space-y-4">
                {response.answers.map((answer) => (
                    <div key={answer.idResponse} className="bg-card p-6 rounded-lg shadow-md">
                        
                        {/* 2. CABEÇALHO DA PERGUNTA COM SCORE INDIVIDUAL */}
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium text-foreground pr-4">
                                {answer.question.text}
                            </h3>
                            {/* 3. EXIBIÇÃO DA PONTUAÇÃO INDIVIDUAL */}
                            {/* Só exibe a pontuação se ela for > 0 ou < 0 (ignora 0) */}
                            {answer.score != null && answer.score !== 0 && (
                                <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full whitespace-nowrap">
                                    Valor: {answer.score}
                                </span>
                            )}
                        </div>

                        {/* O 'prose' adiciona estilos de tipografia */}
                        <div className="prose prose-sm max-w-none text-foreground">
                            {renderAnswer(answer)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};