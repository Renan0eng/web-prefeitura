"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AgendamentosTab from "@/views/appointments/AgendamentosTab"
import EsteiraPacientesTab from "@/views/form-builder/tabs/EsteiraPacientesTab"
import FormulariosTab from "@/views/form-builder/tabs/FormulariosTab"

export default function FormCard() {
  return (
    <Tabs defaultValue="forms" className="flex w-full flex-col justify-start gap-6">
      <TabsList>
        <TabsTrigger value="forms">Formulários</TabsTrigger>
        <TabsTrigger value="esteira-pacientes">Esteira de Pacientes</TabsTrigger>
  <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
      </TabsList>

      <TabsContent value="forms" className="mt-4">
        <FormulariosTab />
      </TabsContent>

      <TabsContent value="esteira-pacientes" className="mt-4">
        <EsteiraPacientesTab />
      </TabsContent>

      <TabsContent value="agendamentos" className="mt-4">
        <AgendamentosTab />
      </TabsContent>
    </Tabs>
  )
}
