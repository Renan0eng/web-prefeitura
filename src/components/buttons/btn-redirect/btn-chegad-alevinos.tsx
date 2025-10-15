"use client"
import { useUser } from "@/hooks/user-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../../ui/button";

export function ButtonChegadaAlevinos({ className }: { className?: string }) {
  const { user } = useUser();

  const slug = "chegada-alevinos";

  const hasAccess = user?.nivel_acesso?.menus.some(
    (menu) => menu.slug === slug && menu.visualizar === true
  );
  

  if (!hasAccess) {
    return null;
  }

  return (
    <Link href="/admin/chegada/alevinos">
      <Button className={cn("", className)}>Chegada Alevinos</Button>
    </Link>
  );
}
