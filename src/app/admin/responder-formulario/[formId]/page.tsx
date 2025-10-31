import { FormViewerPage } from "@/views/form-builder/FormViewerPage";


// Esta página extrai o formId da URL e o passa para o componente cliente
export default function ViewFormPage({ params }: { params: { formId: string } }) {
  const { formId } = params;

  if (!formId) {
    return <div>ID do formulário não encontrado.</div>;
  }

  return <FormViewerPage formId={formId} />;
}