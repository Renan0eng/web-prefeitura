"use client"
import { useUser } from "@/hooks/user-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../../ui/button";

export function ButtonTrato({ className }: { className?: string }) {
  const { user } = useUser();

  const slug = "trato";

  const hasAccess = user?.nivel_acesso?.menus.some(
    (menu) => menu.slug === slug && menu.visualizar === true
  );

  if (!hasAccess) {
    return null;
  }

  return (
    <Link href="/admin/trato">
      <Button className={cn("", className)}>Trato</Button>
    </Link>
  );
}
