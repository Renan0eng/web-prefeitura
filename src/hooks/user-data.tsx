"use client"
import React, { createContext, ReactNode, useContext, useState } from "react"



type UserContextType = {
  user: any | null
  setUser: React.Dispatch<React.SetStateAction<any | null>>
  getNivelAcesso: (slug: string) => any
  getAllNivelAcesso: () => any[]
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)

  const getNivelAcesso = (slug: string) => {
    return user?.nivel_acesso?.menus.find((e: any) => e.slug === slug || e.slug === "")  
  }

  const getAllNivelAcesso = () => {
    return user?.nivel_acesso?.menus 
  }

  return <UserContext.Provider value={{ user, setUser, getNivelAcesso, getAllNivelAcesso }}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used inside UserProvider")
  return ctx
}
