"use client";

import { Alert } from "@/components/ui/alert";
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
    <div className="m-4">
    <Alert variant="destructive">
      You do not have permission to access this page.
    </Alert>
    </div>
  );
}
