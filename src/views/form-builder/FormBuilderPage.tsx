// views/form-builder/FormBuilderPage.tsx
'use client';

import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { FormQuestion, FormState } from '@/types/form-builder';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { PlusCircle, Save, Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuestionCard } from './QuestionCard';

interface FormBuilderPageProps {
    formId?: string; 
}

const EMPTY_STATE: FormState = {
    title: 'Formulário sem título',
    description: '',
    questions: [],
};

export const FormBuilderPage = ({ formId }: FormBuilderPageProps) => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [formState, setFormState] = useState<FormState>(EMPTY_STATE);
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Efeito para buscar dados
    useEffect(() => {
        // Se NÃO houver formId, apenas carregamos o estado vazio.
        if (!formId) {
            setIsLoading(false);
            setIsMounted(true);
            return; // <--- Importante: para a execução
        }

        // Se HOUVER formId, buscamos os dados
        const fetchForm = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/forms/${formId}`);
                const data = response.data;
                setFormState(data);
                if (data.questions.length > 0) {
                    setActiveQuestionId(data.questions[0].id);
                }
            } catch (error) {
                console.error("Falha ao carregar formulário:", error);
                setFormState(EMPTY_STATE);
            } finally {
                setIsLoading(false);
                setIsMounted(true);
            }
        };

        fetchForm();
    }, [formId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (formId) {
                const response = await api.put(`/forms/${formId}`, formState);
                const savedData = response.data;
                setFormState(savedData);
            } else {
                const response = await api.post(`/forms`, formState);
                const newData = response.data;
                router.push(`/admin/criar-formulario/${newData.idForm}`);
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setIsSaving(false);
        }
    };



    const handleOnDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;
        if (type === 'question') {
            const items = Array.from(formState.questions);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setFormState({ ...formState, questions: items });
            return;
        }
        if (type === 'option') {
            const questionId = source.droppableId;
            const question = formState.questions.find(q => q.idQuestion === questionId);
            if (!question) return;
            const reorderedOptions = Array.from(question.options);
            const [movedOption] = reorderedOptions.splice(source.index, 1);
            reorderedOptions.splice(destination.index, 0, movedOption);
            const updatedQuestions = formState.questions.map(q =>
                q.idQuestion === questionId ? { ...q, options: reorderedOptions } : q
            );
            setFormState({ ...formState, questions: updatedQuestions });
        }
    };

    const addQuestion = () => {
        const newQuestion: FormQuestion = {
            idQuestion: uuidv4(),
            text: '',
            type: 'MULTIPLE_CHOICE',
            options: [{ idOption: uuidv4(), text: 'Opção 1', value: null }],
            required: false,
        };
        setFormState({
            ...formState,
            questions: [...formState.questions, newQuestion],
        });
        setActiveQuestionId(newQuestion.idQuestion);
    };

    const updateQuestion = (updatedQuestion: FormQuestion) => {
        const newQuestions = formState.questions.map(q =>
            q.idQuestion === updatedQuestion.idQuestion ? updatedQuestion : q
        );
        setFormState({ ...formState, questions: newQuestions });
    };

    const deleteQuestion = (idToDelete: string) => {
        const newQuestions = formState.questions.filter(q => q.idQuestion !== idToDelete);
        setFormState({ ...formState, questions: newQuestions });
        if (activeQuestionId === idToDelete) {
            setActiveQuestionId(null);
        }
    };

    const duplicateQuestion = (idToDuplicate: string) => {
        const questionToDuplicate = formState.questions.find(q => q.idQuestion === idToDuplicate);
        if (!questionToDuplicate) return;
        const newQuestion: FormQuestion = {
            ...questionToDuplicate,
            idQuestion: uuidv4(),
            options: questionToDuplicate.options.map(opt => ({ ...opt, idOption: uuidv4() }))
        };
        const originalIndex = formState.questions.findIndex(q => q.idQuestion === idToDuplicate);
        const newQuestions = [...formState.questions];
        newQuestions.splice(originalIndex + 1, 0, newQuestion);
        setFormState({ ...formState, questions: newQuestions });
        setActiveQuestionId(newQuestion.idQuestion);
    };

    if (!isMounted || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Carregando construtor...
            </div>
        );
    }

    return (
        <div className=" min-h-screen p-2 sm:p-8" onClick={() => setActiveQuestionId(null)}>
            <div className="fixed sm:top-4 top-16 sm:right-8 right-4 z-50 flex space-x-2">
                <Button
                    onClick={() => router.back()}
                    className="bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                >
                    <Undo2 size={18} />
                    Voltar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                >
                    <Save size={18} />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>

            <div className="fixed sm:right-10 right-3 bottom-10 rounded-lg shadow-lg border z-50">
                <Button onClick={(e) => { e.stopPropagation(); addQuestion(); }} className=" bg-primary hover:bg-primary-600 [&_svg]:text-white [&_svg]:size-6 w-14 h-14 ">
                    <PlusCircle className="text-gray-600" />
                </Button>
            </div>

            <div className="max-w-3xl mx-auto pt-16 sm:pt-0 pb-20">
                <div className="bg-background-foreground p-6 rounded-lg shadow-md border-t-8 border-primary mb-6">
                    <input
                        type="text"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        className="w-full text-3xl border-b-2 border-gray-200 focus:border-primary outline-none pb-2 bg-transparent"
                    />
                    <textarea
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        className="w-full mt-4 text-gray-600 border-b border-gray-200 focus:border-primary outline-none bg-transparent"
                        placeholder="Descrição do formulário"
                    />
                </div>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="questions" type="question">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {formState.questions.map((question, index) => (
                                    <div key={question.idQuestion} onClick={(e) => e.stopPropagation()}>
                                        <QuestionCard
                                            question={question}
                                            index={index}
                                            isActive={activeQuestionId === question.idQuestion}
                                            onClick={() => setActiveQuestionId(question.idQuestion)}
                                            updateQuestion={updateQuestion}
                                            deleteQuestion={() => deleteQuestion(question.idQuestion)}
                                            duplicateQuestion={() => duplicateQuestion(question.idQuestion)}
                                        />
                                    </div>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};