import AssignUserPage from "@/views/assign-user/AssignUserPage";

export default function ViewAssignUserPage({ params }: { params: { idForm: string } }) {
  const { idForm } = params;

  if (!idForm) {
    return <div>ID do formulário não encontrado.</div>;
  }

  return (
      <AssignUserPage idForm={idForm} />
  );
}