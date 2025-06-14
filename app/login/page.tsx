"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("parent")

  const handleLogin = async () => {
    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      // Login with the selected role
      login("user@example.com", activeTab as "parent" | "teacher" | "admin")

      // Redirect based on role
      if (activeTab === "teacher") {
        router.push("/teacher")
      } else if (activeTab === "admin") {
        router.push("/admin")
      } else {
        router.push("/order")
      }

      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-orange-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Bienvenido</CardTitle>
            <CardDescription className="text-center">Entra a la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Tabs defaultValue="parent" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="parent">Padres</TabsTrigger>
                <TabsTrigger value="teacher">Maestras</TabsTrigger>
                <TabsTrigger value="admin">Directivos</TabsTrigger>
              </TabsList>
              <TabsContent value="parent" className="mt-4">
                <p className="text-sm text-gray-500 mb-4">Entra como padre o madre para ordenar el almuerzo de tu hijo</p>
              </TabsContent>
              <TabsContent value="teacher" className="mt-4">
                <p className="text-sm text-gray-500 mb-4">Entra como maestra para ver los pedidos de los estudiantes.</p>
              </TabsContent>
              <TabsContent value="admin" className="mt-4">
                <p className="text-sm text-gray-500 mb-4">Entra como administrador para manejar el registro de pedidos.</p>
              </TabsContent>
            </Tabs>

            <Button
              className="w-full bg-white text-black hover:bg-gray-100 border border-gray-300"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Entra con Google
                </div>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-xs text-center text-gray-500">
              Al continuar acepta los Terminos y Condiciones y las Politicas de Privacidad.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
