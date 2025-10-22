import { FormQuestion } from '@/types/form-builder';

interface QuestionRendererProps {
    question: FormQuestion;
    value: string | string[];
    onChange: (questionId: string, value: string | string[]) => void;
}

// Classe base para estilização dos inputs
const inputBaseClass = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary";
const questionTitleClass = "text-lg font-medium mb-2";

export const QuestionRenderer = ({ question, value, onChange }: QuestionRendererProps) => {
    const { id, text, type, options, required } = question;

    const renderQuestionInput = () => {
        switch (type) {
            case 'SHORT_TEXT':
                return (
                    <input
                        type="text"
                        className={inputBaseClass}
                        value={value as string}
                        onChange={(e) => onChange(id, e.target.value)}
                        required={required}
                        placeholder="Sua resposta"
                    />
                );

            // CORRIGIDO: Alterado de 'LONG_TEXT' para 'PARAGRAPH'
            case 'PARAGRAPH':
                return (
                    <textarea
                        className={inputBaseClass}
                        rows={4}
                        value={value as string}
                        onChange={(e) => onChange(id, e.target.value)}
                        required={required}
                        placeholder="Sua resposta longa"
                    />
                );

            case 'MULTIPLE_CHOICE':
                return (
                    <div className="space-y-2">
                        {options?.map((option) => (
                            <label key={option.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name={id} // O name agrupa os radios
                                    value={option.text}
                                    checked={value === option.text}
                                    onChange={(e) => onChange(id, e.target.value)}
                                    className="form-radio text-primary focus:ring-primary"
                                    required={required}
                                />
                                <span>{option.text}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'CHECKBOXES':
                const currentValues = (value as string[]) || [];

                const handleCheckboxChange = (optionText: string) => {
                    const newValues = currentValues.includes(optionText)
                        ? currentValues.filter(v => v !== optionText)
                        : [...currentValues, optionText];
                    onChange(id, newValues);
                };

                return (
                    <div className="space-y-2">
                        {options?.map((option) => (
                            <label key={option.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    value={option.text}
                                    checked={currentValues.includes(option.text)}
                                    onChange={() => handleCheckboxChange(option.text)}
                                    className="form-checkbox text-primary focus:ring-primary rounded"
                                />
                                <span>{option.text}</span>
                            </label>
                        ))}
                    </div>
                );

            // REMOVIDO: O case 'DROPDOWN' foi removido por não existir no seu QuestionType

            default:
                // Isso ajuda a pegar erros de tipo durante o desenvolvimento
                const exhaustiveCheck: never = type;
                return <p className="text-red-500">Tipo de pergunta não suportado: {exhaustiveCheck}</p>;
        }
    };

    return (
        <div className="bg-background-foreground p-6 rounded-lg shadow-md">
            <h3 className={questionTitleClass}>
                {text || "Pergunta sem título"}
                {required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {renderQuestionInput()}
        </div>
    );
};