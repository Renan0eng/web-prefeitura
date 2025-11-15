'use client';

import { useAuth } from '@/hooks/use-auth';
import api from '@/services/api';
import { FormQuestion, FormState } from '@/types/form-builder';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { QuestionRenderer } from './QuestionRenderer';

// Um tipo para armazenar as respostas. A chave é o question.id
type AnswersState = Record<string, string | string[]>;

interface FormViewerPageProps {
    formId: string;
}

export const FormViewerPage = ({ formId }: FormViewerPageProps) => {
    const { getPermissions, loading: authLoading } = useAuth();
    const permissions = useMemo(() => getPermissions('formulario'), [getPermissions]);

    if (authLoading) {
        return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
    }

    if (!permissions?.visualizar) {
        return <div className="flex justify-center items-center min-h-screen">Você não tem permissão para responder/visualizar este formulário.</div>;
    }
    const [formState, setFormState] = useState<FormState | null>(null);
    const [answers, setAnswers] = useState<AnswersState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const router = useRouter();

    // 1. Efeito para buscar os dados do formulário
    useEffect(() => {
        if (!formId) return;

        const fetchForm = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/forms/${formId}`);
                setFormState(response.data);
                // Inicializa o estado de respostas
                const initialAnswers: AnswersState = {};
                response.data.questions.forEach((q: FormQuestion) => {
                    initialAnswers[q.idQuestion] = q.type === 'CHECKBOXES' ? [] : '';
                });
                setAnswers(initialAnswers);
            } catch (error) {
                console.error("Falha ao carregar formulário:", error);
                setFormState(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForm();
    }, [formId]);

    // 2. Handler para atualizar o estado de respostas
    const handleAnswerChange = (questionidQuestion: string, value: string | string[]) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionidQuestion]: value,
        }));
    };

    // 3. Handler para enviar o formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // Opcional: Validação de campos obrigatórios
        if (formState) {
            for (const question of formState.questions) {
                if (question.required) {
                    const answer = answers[question.idQuestion];
                    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
                        setSubmitError(`A pergunta "${question.text || 'Sem título'}" é obrigatória.`);
                        setIsSubmitting(false);
                        return;
                    }
                }
            }
        }

        try {
            // Transforma o objeto { q1: 'a', q2: ['b', 'c'] }
            // no array [ { questionId: 'q1', value: 'a' }, { questionId: 'q2', values: ['b', 'c'] } ]
            const payload = {
                answers: Object.entries(answers).map(([questionId, answerValue]) => {
                    if (Array.isArray(answerValue)) {
                        return { questionId, values: answerValue };
                    }
                    return { questionId, value: answerValue as string };
                }),
            };

            await api.post(`/forms/${formId}/responses`, payload);
            router.back();
            setSubmitSuccess(true);
        } catch (error) {
            console.error("Erro ao enviar resposta:", error);
            setSubmitError("Não foi possível enviar sua resposta. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Renderização ---

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Carregando formulário...</div>;
    }

    if (!formState) {
        return <div className="flex justify-center items-center min-h-screen">Formulário não encontrado.</div>;
    }

    if (submitSuccess) {
        return (
            <div className="max-w-3xl mx-auto p-8">
                <div className="bg-background-foreground p-6 rounded-lg shadow-md border-t-8 border-primary">
                    <h1 className="text-3xl mb-2">{formState.title}</h1>
                    <p className="text-lg text-green-600">Obrigado! Sua resposta foi registrada.</p>
                </div>
            </div>
        );
    }

    return (
        <form className="min-h-screen p-8" onSubmit={handleSubmit}>
            <div className="max-w-3xl mx-auto">
                {/* Cabeçalho do Formulário */}
                <div className="bg-background-foreground p-6 rounded-lg shadow-md border-t-8 border-primary mb-6">
                    <h1 className="text-3xl mb-2">{formState.title}</h1>
                    {formState.description && <p className="text-gray-600">{formState.description}</p>}
                </div>

                {/* Perguntas */}
                <div className="space-y-6">
                    {formState.questions.map((question) => (
                        <QuestionRenderer
                            key={question.idQuestion}
                            question={question}
                            value={answers[question.idQuestion]}
                            onChange={handleAnswerChange}
                        />
                    ))}
                </div>

                {/* Envio */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                    >
                        <Send size={18} />
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>
                    {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                </div>
            </div>
        </form>
    );
};