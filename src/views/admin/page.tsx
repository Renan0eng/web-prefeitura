"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";
import DashAdmin from "./dash/dash-admin";
import DashProfessional from "./dash/dash-proficional";


export default function Admin() {

  const { getPermissions, loading } = useAuth()

  const perms = useMemo(() => ({
    admin: getPermissions("dash-admin"),
    professional: getPermissions("dash-professional"),
  }), [getPermissions]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center p-8">
        <div className="w-full max-w-5xl space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-3/4" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-3/4" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (perms.admin) {
    return (
      <DashAdmin />
    );
  }

  if (perms.professional) {
    return (
      <DashProfessional />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Dashboard indisponível</CardTitle>
          <CardDescription>Você ainda não tem um dashboard disponível para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">Parece que sua conta não possui permissões para acessar os dashboards do sistema.</p>
          <div className="flex flex-col sm:flex-row gap-3">
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
