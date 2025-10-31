// views/form-builder/QuestionCard.tsx

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormQuestion, FormQuestionOption, QuestionType } from '@/types/form-builder';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { Copy, GripHorizontal, GripVertical, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

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

    const handleTypeChange = (value: string) => {
        const newType = value as QuestionType;
        updateQuestion({ ...question, type: newType });
    };

    const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateQuestion({ ...question, required: e.target.checked });
    };

    const handleOptionTextChange = (optionId: string, text: string) => {
        const newOptions = question.options.map(opt =>
            opt.idOption === optionId ? { ...opt, text } : opt
        );
        updateQuestion({ ...question, options: newOptions });
    };

    const handleOptionValueChange = (optionId: string, value: string) => {
        const newOptions = question.options.map(opt =>
            opt.idOption === optionId ? { ...opt, value: parseFloat(value) } : opt
        );
        updateQuestion({ ...question, options: newOptions });
    };

    const addOption = () => {
        const newOption: FormQuestionOption = { idOption: uuidv4(), text: `Opção ${question.options.length + 1}` };
        const newOptions = [...question.options, newOption];
        updateQuestion({ ...question, options: newOptions });
    };

    const removeOption = (optionId: string) => {
        const newOptions = question.options.filter(opt => opt.idOption !== optionId);
        updateQuestion({ ...question, options: newOptions });
    };

    const showOptions = question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOXES';

    return (
        <Draggable draggableId={question.idQuestion} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={clsx(
                        "relative bg-background-foreground p-6 rounded-lg shadow-md border border-gray-200 mb-4 transition-all",
                        {
                            "border-l-4 border-primary": isActive,
                            "border-l-4 border-transparent": !isActive,
                            "shadow-xl": snapshot.isDragging,
                        }
                    )}
                    onClick={onClick}
                >
                    {/* Alça de arraste da Pergunta */}
                    <div {...provided.dragHandleProps} className="absolute top-3 left-1/2 -translate-x-1/2 cursor-grab">
                        <GripHorizontal size={24} className="text-gray-400" />
                    </div>

                    {/* Cabeçalho da Pergunta (Input de texto e Seletor de tipo) */}
                    <div className="pt-6 flex justify-between items-start gap-4 sm:flex-row flex-col">
                        <input
                            type="text"
                            value={question.text}
                            onChange={handleTextChange}
                            className="w-full text-lg border-b-2 bg-transparent focus:border-primary outline-none pb-2 flex-grow"
                            placeholder="Pergunta"
                        />
                        {isActive && (
                            <Select value={question.type} onValueChange={handleTypeChange} >
                                <SelectTrigger className="sm:w-[240px] w-full bg-background-foreground">
                                    <div className="flex items-center">
                                        <SelectValue placeholder="Tipo de pergunta" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-background-foreground">
                                    <SelectItem value="MULTIPLE_CHOICE">
                                        <div className="flex items-center">
                                            Múltipla escolha
                                        </div>
                                    </SelectItem>
                                    {/* <SelectItem value="SHORT_TEXT">
                                        <div className="flex items-center">
                                            Resposta curta
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="PARAGRAPH">
                                        <div className="flex items-center">
                                            Parágrafo
                                        </div>
                                    </SelectItem> */}
                                    <SelectItem value="CHECKBOXES">
                                        <div className="flex items-center">
                                            Caixas de seleção
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Corpo da Pergunta (Opções ou Placeholder) */}
                    <div className="mt-4">
                        {showOptions ? (
                            <Droppable droppableId={question.idQuestion} type="option">
                                {(droppableProvided) => (
                                    <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps} className="space-y-3">
                                        {question.options.map((option, optionIndex) => (
                                            <Draggable key={option.idOption} draggableId={option.idOption} index={optionIndex}>
                                                {(draggableProvided) => (
                                                    <div
                                                        ref={draggableProvided.innerRef}
                                                        {...draggableProvided.draggableProps}
                                                        className="flex items-center group gap-2"
                                                    >
                                                        {/* Alça de arraste da Opção */}
                                                        <div {...draggableProvided.dragHandleProps} className="cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <GripVertical size={20} />
                                                        </div>

                                                        {/* Input Visual (Radio ou Checkbox) */}
                                                        {question.type === 'MULTIPLE_CHOICE' ? (
                                                            <RadioGroup>
                                                                <RadioGroupItem value={option.idOption} disabled className="mr-1" />
                                                            </RadioGroup>
                                                        ) : (
                                                            <Checkbox id={`cb-${option.idOption}`} disabled className="mr-1" />
                                                        )}

                                                        {/* Input de Texto da Opção */}
                                                        
                                                        <div className='flex w-full items-center border-b-2 border-gray-200 focus-within:border-primary transition-colors'>
                                                            <Input
                                                                type="text"
                                                                placeholder='Opção X'
                                                                value={option.text}
                                                                onChange={(e) => handleOptionTextChange(option.idOption, e.target.value)}
                                                                className="w-full border-gray-200 border-0 bg-transparent outline-none rounded-none pb-1 placeholder:text-gray-400"
                                                            />
                                                            {/* Input de numero value */}
                                                            <Input
                                                                type="number"
                                                                placeholder='Valor'
                                                                value={option.value || undefined}
                                                                onChange={(e) => handleOptionValueChange(option.idOption, e.target.value)}
                                                                className="w-[80px] border-gray-200 border-0 bg-transparent outline-none rounded-none pb-1 placeholder:text-gray-400 no-arrows text-right"
                                                            />
                                                        </div>


                                                        {/* Botão Remover Opção */}
                                                        {question.options.length > 1 && (
                                                            <Button variant="ghost" size="icon" onClick={() => removeOption(option.idOption)} className="ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent">
                                                                <X size={20} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {droppableProvided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ) : (
                            <div className="border-b-2 border-dotted w-1/2 text-gray-500 pb-1">
                                {question.type === 'SHORT_TEXT' ? 'Texto de resposta curta' : 'Texto de resposta longa'}
                            </div>
                        )}

                        {showOptions && isActive && (
                            <div className="mt-4 flex items-center pl-8">
                                {question.type === 'MULTIPLE_CHOICE' ? (
                                    <RadioGroup>
                                        <RadioGroupItem value="add" disabled className="mr-3" />
                                    </RadioGroup>
                                ) : (
                                    <Checkbox id="cb-add" disabled className="mr-3" />
                                )}
                                <Button variant="link" onClick={addOption} className="text-primary p-0 h-auto">
                                    Adicionar opção
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Rodapé da Pergunta (Ações) */}
                    {isActive && (
                        <>
                            <hr className="my-6" />
                            <div className="flex justify-end items-center gap-6">
                                <button onClick={duplicateQuestion} className="text-gray-500 hover:text-gray-800">
                                    <Copy />
                                </button>
                                <button onClick={deleteQuestion} className="text-gray-500 hover:text-gray-800">
                                    <Trash2 />
                                </button>
                                <div className="border-l h-6"></div>
                                <label className="flex items-center cursor-pointer">
                                    <span className="mr-3 text-gray-700">Obrigatória</span>
                                    <input type="checkbox" checked={question.required} onChange={handleRequiredChange} className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Draggable>
    );
};