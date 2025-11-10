'use client'

import AssignUser from "@/components/assign-user/AssignUser";
import BtnVoltar from "@/components/buttons/btn-voltar";
import { useRouter } from "next/navigation";

export default function AssignUserPage({ idForm }: { idForm: string }) {

    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto relative xxl:pt-0 pt-8">
            <BtnVoltar/>
            <AssignUser idForm={idForm} />
        </div>
    )
}