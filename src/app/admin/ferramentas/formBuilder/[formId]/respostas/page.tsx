import { ResponseListPage } from "@/views/form-builder/ResponseListPage";

export default function ListResponsesPage({ params }: { params: { formId: string } }) {
    return <ResponseListPage formId={params.formId} />;
}