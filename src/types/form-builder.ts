// types/form-builder.ts

export interface FormQuestionOption {
  id: string;
  text: string;
}

// Expanda os tipos de pergunta aqui
export type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_TEXT' | 'PARAGRAPH' | 'CHECKBOXES';

export interface FormQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean; // Nova propriedade!
  options: FormQuestionOption[];
}

export interface FormState {
  title: string;
  description: string;
  questions: FormQuestion[];
}