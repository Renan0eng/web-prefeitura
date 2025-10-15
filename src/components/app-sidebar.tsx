"use client"

import {
  LucideIcon
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/user-data"
import { data } from "@/lib/nav"
import { filtrarMenusPorAcesso } from "@/lib/utils"
import { NavUser } from "./nav-user"

type Menu = {
  navMain: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[],
  flow: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [sideItems, setSideItems] = React.useState<Menu>({ navMain: [], flow: [] })
  const { user } = useUser()


  React.useEffect(() => {
    if (!user) return
    
    const menusFiltrados = filtrarMenusPorAcesso(
      data.navMain,
      user?.nivel_acesso?.menus ?? []
    )

    const flowsFiltrados = filtrarMenusPorAcesso(
      data.flow ?? [],
      user?.nivel_acesso?.menus ?? []
    )

    setSideItems({
      navMain: menusFiltrados,
      flow: flowsFiltrados,
    })
  }, [user])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-text">
                  <img src="/logo.webp" alt="Logo" className="h-8 w-8" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Icarus</span>
                  <span className="truncate text-xs">Produção Aquícola</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {sideItems.flow.length > 0 && <NavMain items={sideItems.flow} title="Fluxos" />}
        {sideItems.navMain.length > 0 && <NavMain items={sideItems.navMain} title="Menu" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

