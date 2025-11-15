"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/hooks/use-auth'
import AgendamentosTab from "@/views/form-builder/tabs/AgendamentosTab"
import EsteiraPacientesTab from "@/views/form-builder/tabs/EsteiraPacientesTab"
import FormulariosTab from "@/views/form-builder/tabs/FormulariosTab"
import { useMemo } from 'react'

export default function FormCard() {
  const { getPermissions } = useAuth()
  const formularioPerm = useMemo(() => getPermissions ? getPermissions('formulario') : null, [getPermissions])


  return (
    <Tabs defaultValue={formularioPerm?.visualizar ? "forms" : "esteira-pacientes"} className="flex w-full flex-col justify-start gap-6">
      <TabsList>
        {formularioPerm?.visualizar && <TabsTrigger value="forms">Formulários</TabsTrigger>}
        <TabsTrigger value="esteira-pacientes">Esteira de Pacientes</TabsTrigger>
        <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
      </TabsList>

      {formularioPerm?.visualizar && <TabsContent value="forms" className="mt-4">
        <FormulariosTab />
      </TabsContent>}

      <TabsContent value="esteira-pacientes" className="mt-4">
        <EsteiraPacientesTab />
      </TabsContent>

      <TabsContent value="agendamentos" className="mt-4">
        <AgendamentosTab />
      </TabsContent>
    </Tabs>
  )
}
