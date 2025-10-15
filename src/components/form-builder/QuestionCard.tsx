// components/form-builder/QuestionCard.tsx

import { FormQuestion, FormQuestionOption, QuestionType } from '@/types/form-builder';
import { Draggable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { Copy, GripHorizontal, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface QuestionCardProps {
    question: FormQuestion;
    index: number;
    isActive: boolean;
    onClick: () => void;
    updateQuestion: (question: FormQuestion) => void;
    deleteQuestion: () => void;
    duplicateQuestion: () => void;
}

export const QuestionCard = ({
    question,
    index,
    isActive,
    onClick,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion
}: QuestionCardProps) => {

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateQuestion({ ...question, text: e.target.value });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as QuestionType;
        // Se mudar para um tipo que não tem opções, mas antes tinha, mantemos as opções no estado
        // para o caso de o usuário voltar atrás. Apenas não as renderizamos.
        updateQuestion({ ...question, type: newType });
    };

    const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateQuestion({ ...question, required: e.target.checked });
    };

    const handleOptionTextChange = (optionId: string, text: string) => {
        const newOptions = question.options.map(opt =>
            opt.id === optionId ? { ...opt, text } : opt
        );
        updateQuestion({ ...question, options: newOptions });
    };

    const addOption = () => {
        const newOption: FormQuestionOption = { id: uuidv4(), text: `Opção ${question.options.length + 1}` };
        const newOptions = [...question.options, newOption];
        updateQuestion({ ...question, options: newOptions });
    };

    const removeOption = (optionId: string) => {
        const newOptions = question.options.filter(opt => opt.id !== optionId);
        updateQuestion({ ...question, options: newOptions });
    };

    // Determina se o tipo de pergunta atual deve mostrar a lista de opções
    const showOptions = question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOXES';

    return (
        <Draggable draggableId={question.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={clsx(
                        // Nota: 'bg-background-foreground' parece ser uma cor customizada. Usei 'bg-white' como padrão.
                        "relative bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4 transition-all",
                        {
                            // Nota: 'border-primary' parece ser uma cor customizada. Usei 'border-purple-600' como padrão.
                            "border-l-4 border-purple-600": isActive,
                            "border-l-4 border-transparent": !isActive,
                            "shadow-xl": snapshot.isDragging,
                        }
                    )}
                    onClick={onClick}
                >
                    <div {...provided.dragHandleProps} className="absolute top-3 left-1/2 -translate-x-1/2 cursor-grab">
                        <GripHorizontal size={24} className="text-gray-400" />
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="pt-6 flex justify-between items-start gap-4">
                        <input
                            type="text"
                            value={question.text}
                            onChange={handleTextChange}
                            className="w-full text-lg border-b-2 bg-transparent focus:border-purple-600 outline-none pb-2 flex-grow"
                            placeholder="Pergunta"
                        />
                        {isActive && (
                            <select value={question.type} onChange={handleTypeChange} className="border border-gray-300 rounded-md p-2">
                                <option value="MULTIPLE_CHOICE">Múltipla escolha</option>
                                <option value="SHORT_TEXT">Resposta curta</option>
                                <option value="PARAGRAPH">Parágrafo</option>
                                <option value="CHECKBOXES">Caixas de seleção</option>
                            </select>
                        )}
                    </div>

                    {/* Corpo da Pergunta: Opções ou Placeholder */}
                    <div className="mt-4">
                        {showOptions ? (
                            <div className="space-y-3">
                                {question.options.map((option) => (
                                    <div key={option.id} className="flex items-center group">
                                        <input type={question.type === 'MULTIPLE_CHOICE' ? 'radio' : 'checkbox'} className="mr-3" disabled />
                                        <input type="text" value={option.text} onChange={(e) => handleOptionTextChange(option.id, e.target.value)} className="w-full border-b border-gray-200 focus:border-gray-400 bg-transparent outline-none py-1" />
                                        {question.options.length > 1 && (
                                            <button onClick={() => removeOption(option.id)} className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"><X size={20} /></button>
                                        )}
                                    </div>
                                ))}
                                {isActive && (
                                    <div className="mt-4 flex items-center">
                                        <input type={question.type === 'MULTIPLE_CHOICE' ? 'radio' : 'checkbox'} className="mr-3" disabled />
                                        <button onClick={addOption} className="text-purple-600 hover:underline">Adicionar opção</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="border-b-2 border-dotted w-1/2 text-gray-500 pb-1">
                                {question.type === 'SHORT_TEXT' ? 'Texto de resposta curta' : 'Texto de resposta longa'}
                            </div>
                        )}
                    </div>

                    {/* Barra de Ferramentas Inferior */}
                    {isActive && (
                        <>
                            <hr className="my-6" />
                            <div className="flex justify-end items-center gap-6">
                                <button onClick={duplicateQuestion} className="text-gray-500 hover:text-gray-800"><Copy /></button>
                                <button onClick={deleteQuestion} className="text-gray-500 hover:text-gray-800"><Trash2 /></button>
                                <div className="border-l h-6"></div>
                                {/* Switch de Obrigatória */}
                                <label className="flex items-center cursor-pointer">
                                    <span className="mr-3 text-gray-700">Obrigatória</span>
                                    <input type="checkbox" checked={question.required} onChange={handleRequiredChange} className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Draggable>
    );
};