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

// Tipo para o usuário que respondeu
export interface FormSubmitter {
  idUser: string;
  name: string;
  email: string;
}

// Tipo para a lista de respostas (Tela 1)
export interface FormResponseSummary {
  id: string; // ID da Response
  submittedAt: string;
  user: FormSubmitter | null;
}

// Tipo para o formulário na lista
export interface FormWithResponses {
  id: string;
  title: string;
  responses: FormResponseSummary[];
}

// Tipo para a resposta individual (Tela 2)
export interface ResponseAnswerDetail {
  id: string;
  value: string | null;
  values: string[];
  question: {
    id: string;
    text: string;
    type: QuestionType;
  };
}

// Tipo para o detalhe da resposta (Tela 2)
export interface FormResponseDetail {
  id: string;
  submittedAt: string;
  user: FormSubmitter | null;
  form: {
    id: string;
    title: string;
  };
  answers: ResponseAnswerDetail[];
}