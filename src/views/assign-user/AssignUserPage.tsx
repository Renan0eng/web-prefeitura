'use client'

import AssignUser from "@/components/assign-user/AssignUser";
import BtnVoltar from "@/components/buttons/btn-voltar";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from "next/navigation";
import { useMemo } from 'react';

export default function AssignUserPage({ idForm }: { idForm: string }) {

    const router = useRouter();
    const { getPermissions, loading: authLoading } = useAuth();
    const permissions = useMemo(() => getPermissions('atribuir-usuarios'), [getPermissions]);

    if (authLoading) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />

                    <div className="bg-background-foreground p-4 rounded-lg mt-4">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!permissions?.visualizar) return <div className="max-w-4xl mx-auto p-8">Você não tem permissão para acessar esta página.</div>;

    return (
        <div className="max-w-4xl mx-auto relative xxl:pt-0 pt-8">
            <BtnVoltar/>
            <AssignUser idForm={idForm} />
        </div>
    )
}