"use client";

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"


type UserRole = "parent" | "teacher" | "admin" | null
type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  courses?: string[] // Only for teachers
}

interface AuthContextType {
  user: User | null
  status: AuthStatus
  login: (email: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  useEffect(() => {
    // Check if user is authenticated on mount
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const storedUser = localStorage.getItem("user")

    if (isAuthenticated === "true" && storedUser) {
      setUser(JSON.parse(storedUser))
      setStatus("authenticated")
    } else {
      setStatus("unauthenticated")
    }
  }, [])

  const login = (email: string, role: UserRole) => {
    // Create a user object based on role
    let userName = "Parent User"
    if (role === "teacher") userName = "Ms. Johnson"
    if (role === "admin") userName = "Admin User"

    const newUser: User = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: userName,
      email,
      role,
    }

    // Add courses for teachers
    if (role === "teacher") {
      newUser.courses = ["Class 3A", "Class 5B"]
    }

    // Save to localStorage
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(newUser))

    setUser(newUser)
    setStatus("authenticated")
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    setUser(null)
    setStatus("unauthenticated")
  }

  return <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>
}
