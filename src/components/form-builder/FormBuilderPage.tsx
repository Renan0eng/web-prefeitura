// components/form-builder/FormBuilderPage.tsx

'use client';

import { FormQuestion, FormState } from '@/types/form-builder';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuestionCard } from './QuestionCard'; // Importe o novo componente

export const FormBuilderPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [formState, setFormState] = useState<FormState>({
        title: 'Formulário sem título',
        description: '',
        questions: [],
    });
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

    // ... (os dois useEffect para carregar e salvar no localStorage permanecem os mesmos) ...

    useEffect(() => {
        try {
            const savedForm = localStorage.getItem('formBuilderState');
            if (savedForm) {
                // AQUI ESTÁ A CORREÇÃO
                const parsedForm = JSON.parse(savedForm) as FormState;
                setFormState(parsedForm);

                if (parsedForm.questions.length > 0) {
                    setActiveQuestionId(parsedForm.questions[0].id);
                }
            } else {
                // Se não houver nada salvo, carrega o estado inicial padrão
                const initialQuestions = [
                    { id: uuidv4(), text: 'Qual sua cor favorita?', type: 'MULTIPLE_CHOICE' as const, required: false, options: [{ id: uuidv4(), text: 'Azul' }, { id: uuidv4(), text: 'Verde' }] },
                    { id: uuidv4(), text: 'Qual seu nome?', type: 'SHORT_TEXT' as const, required: true, options: [] },
                ];
                setFormState({
                    title: 'Formulário sem título',
                    description: '',
                    questions: initialQuestions,
                });
                setActiveQuestionId(initialQuestions[0].id);
            }
        } catch (error) {
            console.error("Failed to parse form state from localStorage", error);
        }
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('formBuilderState', JSON.stringify(formState));
        }
    }, [formState, isMounted]);

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(formState.questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFormState({ ...formState, questions: items });
    };

    const addQuestion = () => {
        const newQuestion: FormQuestion = {
            id: uuidv4(),
            text: '',
            type: 'MULTIPLE_CHOICE',
            options: [{ id: uuidv4(), text: 'Opção 1' }],
            required: false,
        };
        setFormState({
            ...formState,
            questions: [...formState.questions, newQuestion],
        });
        // Define a nova pergunta como ativa
        setActiveQuestionId(newQuestion.id);
    };

    const updateQuestion = (updatedQuestion: FormQuestion) => {
        const newQuestions = formState.questions.map(q =>
            q.id === updatedQuestion.id ? updatedQuestion : q
        );
        setFormState({ ...formState, questions: newQuestions });
    };

    const deleteQuestion = (idToDelete: string) => {
        const newQuestions = formState.questions.filter(q => q.id !== idToDelete);
        setFormState({ ...formState, questions: newQuestions });
        // Se o card deletado era o ativo, desativa
        if (activeQuestionId === idToDelete) {
            setActiveQuestionId(null);
        }
    };

    const duplicateQuestion = (idToDuplicate: string) => {
        const questionToDuplicate = formState.questions.find(q => q.id === idToDuplicate);
        if (!questionToDuplicate) return;

        const newQuestion: FormQuestion = {
            ...questionToDuplicate,
            id: uuidv4(),
            options: questionToDuplicate.options.map(opt => ({ ...opt, id: uuidv4() }))
        };

        const originalIndex = formState.questions.findIndex(q => q.id === idToDuplicate);
        const newQuestions = [...formState.questions];
        newQuestions.splice(originalIndex + 1, 0, newQuestion);

        setFormState({ ...formState, questions: newQuestions });
        setActiveQuestionId(newQuestion.id);
    };

    if (!isMounted) return null;

    return (
        <div className=" min-h-screen p-8" onClick={() => setActiveQuestionId(null)}>
            {/* Barra de Ferramentas Flutuante */}
            <div className="fixed right-10 top-1/3 bg-background-foreground p-2 rounded-lg shadow-lg border">
                <button onClick={addQuestion} className="p-2 hover:bg-gray-100 rounded-full">
                    <PlusCircle className="text-gray-600" />
                </button>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Cabeçalho do Formulário */}
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

                {/* Lista de Perguntas */}
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="questions">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {formState.questions.map((question, index) => (
                                    <div key={question.id} onClick={(e) => e.stopPropagation()}>
                                        <QuestionCard
                                            question={question}
                                            index={index}
                                            isActive={activeQuestionId === question.id}
                                            onClick={() => setActiveQuestionId(question.id)}
                                            updateQuestion={updateQuestion}
                                            deleteQuestion={() => deleteQuestion(question.id)}
                                            duplicateQuestion={() => duplicateQuestion(question.id)}
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