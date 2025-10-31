import { ResponseDetailPage } from "@/views/form-builder/ResponseDetailPage";

export default function ViewResponsePage({ params }: { params: { responseId: string } }) {
  // O formId está na URL, mas não é estritamente necessário para a API
  // Apenas o responseId é, mas mantemos o componente no mesmo lugar por organização
  return <ResponseDetailPage responseId={params.responseId} />;
}