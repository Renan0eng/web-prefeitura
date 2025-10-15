// components/SetLoteFromParams.tsx
"use client"
import { CadastroTanqueSchema } from "@/Schemas/tanque";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";

export function SetLoteFromParams({
    setValue,
    setId_lote
}: {
    setValue: UseFormSetValue<CadastroTanqueSchema>,
    setId_lote: (id: string) => void
}) {

    const searchParams = useSearchParams();

    useEffect(() => {
        const loteIdFromUrl = searchParams.get("loteId");
        if (loteIdFromUrl) {
            setValue("id_lote", loteIdFromUrl);
            setId_lote(loteIdFromUrl);
        }
    }, [searchParams]);

    return null;
}
