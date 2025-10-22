import { FormBuilderPage } from "@/views/form-builder/FormBuilderPage";

export default function EditFormPage({ params }: { params: { formId: string } }) {

    console.log("formId: ", params.formId);

    return (<FormBuilderPage formId={params.formId} />);
}