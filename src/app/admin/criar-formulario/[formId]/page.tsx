import { FormBuilderPage } from "@/views/form-builder/FormBuilderPage";

export default function EditFormPage({ params }: { params: { formId: string } }) {
    return (<FormBuilderPage formId={params.formId} />);
}