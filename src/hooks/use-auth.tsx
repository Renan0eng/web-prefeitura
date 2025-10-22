"use client"
import { useRouter } from "next/navigation"
import React, { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"
import { useAlert } from "./use-alert"

export type User =  {
    nivel_acesso: {
        menus: {
            nome: string;
            idMenuAcesso: number;
            slug: string;
            visualizar: boolean;
            criar: boolean;
            editar: boolean;
            excluir: boolean;
            relatorio: boolean;
        }[];
    } & {
        idNivelAcesso: number;
        nome: string;
        descricao: string | null;
    };
    idUser: string;
    name: string;
    avatar: string | null;
    email: string;
    cpf: string | null;
    cep: string | null;
    phone: string | null;
    user_id_create: number | null;
    user_id_update: number | null;
    user_id_delete: number | null;
    dt_delete: Date | null;
    created: Date;
    updated: Date | null;
    active: boolean;
    nivelAcessoId: number;
}

type AuthContextType = {
  user: User | null
  accessToken: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true) 
  const { setAlert } = useAlert()

  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: refreshData } = await api.post('/auth/refresh')
        
        const newAccessToken = refreshData.accessToken
        setAccessToken(newAccessToken)

        const { data } = await api.get('/auth/me', {
          headers: {
            'Authorization': `Bearer ${newAccessToken}`
          }
        })
        
        setUser(data)

      } catch (err) {
        console.error("Nenhuma sessão válida encontrada.", err)
        router.push('/auth/login')
        setUser(null)
        setAccessToken(null)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, []) 

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [accessToken]) 

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login-web', { email, password })
      const data = response.data
      setAccessToken(data.accessToken)
      setUser(data.user)
      setAlert(`Bem-vindo(a), ${data.user.name}`, "success")
    } catch (err: any) {
      setAlert( err.response.data.message || "Email ou senha inválidos", "error")
      throw err
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout-web') 
      setAlert("Você saiu com sucesso.", "success")
      setUser(null)
      setAccessToken(null)
      router.push('/auth/login')
    } catch (err) {
      console.error("Erro ao invalidar sessão no backend", err)
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)