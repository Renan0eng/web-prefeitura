"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EsteiraPacientesTab from "@/views/form-builder/tabs/EsteiraPacientesTab"
import FormulariosTab from "@/views/form-builder/tabs/FormulariosTab"

export default function FormCard() {
  return (
    <Tabs defaultValue="forms" className="flex w-full flex-col justify-start gap-6">
      <TabsList>
        <TabsTrigger value="forms">Formulários</TabsTrigger>
        <TabsTrigger value="esteira-pacientes">Esteira de Pacientes</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>

      <TabsContent value="forms" className="mt-4">
        <FormulariosTab />
      </TabsContent>

      <TabsContent value="esteira-pacientes" className="mt-4">
        <EsteiraPacientesTab />
      </TabsContent>

      <TabsContent value="tab3" className="mt-4">
        tab 3 content
      </TabsContent>
    </Tabs>
  )
}
