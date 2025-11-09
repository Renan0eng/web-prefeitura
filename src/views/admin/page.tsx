"use client";

import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo } from "react";
import DashAdmin from "./dash/dash-admin";
import DashProfessional from "./dash/dash-proficional";


export default function Admin() {

  const { getPermissions, loading } = useAuth()

  const perms = useMemo(() => ({
    admin: getPermissions("dash-admin"),
    professional: getPermissions("dash-professional"),
  }), [getPermissions])

  useEffect(() => {
    console.log("perms: ", perms);
  }, [perms])

  if (loading) {
    return <div>Loading...</div>
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
    <Alert variant="destructive">
      You do not have permission to access this page.
    </Alert>
  );
}
