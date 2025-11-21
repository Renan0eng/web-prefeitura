import RegisterPatientPage from "@/views/registrar-paciente/page";

export default function page({ params }: { params: { idUser: string } }) {
  const { idUser } = params;
  return <div>
    <RegisterPatientPage idUser={idUser} />
  </div>
}
