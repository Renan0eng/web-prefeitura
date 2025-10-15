"use client"
import { Menu_Acesso, Prisma } from "@prisma/client"
import React, { createContext, ReactNode, useContext, useState } from "react"


export type UserWithNivelAcesso = Prisma.UserGetPayload<{
  include: {
    nivel_acesso: {
      include: {
        menus: true
      }
    }
  }
}>

type UserContextType = {
  user: UserWithNivelAcesso | null
  setUser: React.Dispatch<React.SetStateAction<UserWithNivelAcesso | null>>
  getNivelAcesso: (slug: string) => Menu_Acesso
  getAllNivelAcesso: () => Menu_Acesso[]
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithNivelAcesso | null>(null)

  const getNivelAcesso = (slug: string) => {
    return user?.nivel_acesso?.menus.find((e) => e.slug === slug) as Menu_Acesso
  }

  const getAllNivelAcesso = () => {
    return user?.nivel_acesso?.menus as Menu_Acesso[]
  }

  return <UserContext.Provider value={{ user, setUser, getNivelAcesso, getAllNivelAcesso }}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used inside UserProvider")
  return ctx
}
