'use client';

import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { FormResponseDetail, ResponseAnswerDetail } from '@/types/form-builder';
import { ArrowLeft, Calculator, Calendar, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 1. NOVAS IMPORTAÇÕES
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ResponseDetailPageProps {
    responseId: string;
}

type ApiResponse = FormResponseDetail & { totalScore: number };

export const ResponseDetailPage = ({ responseId }: ResponseDetailPageProps) => {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchResponseDetail = async () => {
            try {
                setIsLoading(true);
                const res = await api.get<ApiResponse>(`/forms/response/${responseId}`);
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

    // 2. FUNÇÃO 'renderAnswer' COMPLETAMENTE SUBSTITUÍDA
    const renderAnswer = (answer: ResponseAnswerDetail) => {
        const { question, value, values } = answer;

        switch (question.type) {
            
            // --- Caso 1: Múltipla Escolha ---
            case 'MULTIPLE_CHOICE':
                if (!value) {
                    return <p className="italic text-muted-foreground">Não respondido</p>;
                }
                return (
                    // O 'value' no RadioGroup define qual RadioGroupItem está marcado
                    // 'disabled' impede qualquer alteração
                    <RadioGroup value={value} disabled className="mt-2 space-y-2">
                        {question.options?.map((option) => (
                            <div key={option.idOption} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={option.text}
                                    id={`r-${answer.idResponse}-${option.idOption}`}
                                />
                                <Label htmlFor={`r-${answer.idResponse}-${option.idOption}`} className="font-normal text-foreground">
                                    {option.text}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            // --- Caso 2: Caixas de Seleção ---
            case 'CHECKBOXES':
                if (values.length === 0) {
                    return <p className="text-muted-foreground italic">Nenhuma opção selecionada.</p>;
                }
                // Renderiza TODAS as opções, e marca as que estão em 'answer.values'
                return (
                    <div className="mt-2 space-y-2">
                        {question.options?.map((option) => (
                            <div key={option.idOption} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`c-${answer.idResponse}-${option.idOption}`}
                                    checked={values.includes(option.text)} // Define se está marcado
                                    disabled // Impede qualquer alteração
                                />
                                <Label htmlFor={`c-${answer.idResponse}-${option.idOption}`} className="font-normal text-foreground">
                                    {option.text}
                                </Label>
                            </div>
                        ))}
                    </div>
                );

            // --- Caso 3: Textos ---
            case 'SHORT_TEXT':
            case 'PARAGRAPH':
                if (!value) {
                    return <p className="italic text-muted-foreground">Não respondido</p>;
                }
                return (
                    <blockquote className="mt-2 border-l-2 pl-4 italic text-foreground">
                        {value}
                    </blockquote>
                );
            
            default:
                return <p className="italic text-muted-foreground">Tipo de pergunta não suportado.</p>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 relative">
            <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="absolute top-6 left-0 sm:left-[-70px] rounded-full text-muted-foreground hover:text-white hover:border-primary hover:bg-primary"
            >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar</span>
            </Button>

            {/* Cabeçalho */}
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
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium text-foreground pr-4">
                                {answer.question.text}
                            </h3>
                            {answer.score != null && answer.score !== 0 && (
                                <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full whitespace-nowrap">
                                    Valor: {answer.score}
                                </span>
                            )}
                        </div>

                        {/* A nova função renderAnswer será chamada aqui */}
                        <div className="max-w-none">
                            {renderAnswer(answer)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};