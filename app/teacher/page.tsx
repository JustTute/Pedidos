"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { ClipboardList } from "lucide-react"
import Link from "next/link"

export default function TeacherDashboard() {
  const router = useRouter()
  const { user, status } = useAuth()

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && user?.role !== "teacher") {
      router.push("/order")
    }
  }, [status, user, router])

  if (status === "loading" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Panel de Maestras</CardTitle>
            </div>
            <CardDescription>Bienvenida, {user.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Link href="/teacher/orders" passHref>
                <Button className="w-full h-auto py-6 bg-orange-500 hover:bg-orange-600 justify-start">
                  <div className="flex items-center">
                    <ClipboardList className="h-6 w-6 mr-4" />
                    <div className="text-left">
                      <div className="font-medium">Mirar las ordenes:</div>
                      <div className="text-xs opacity-90">Mira los pedidos de tus clases</div>
                    </div>
                  </div>
                </Button>
              </Link>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h3 className="font-medium text-orange-800 mb-2">Tus Clases</h3>
                <ul className="space-y-2">
                  {user.courses?.map((course) => (
                    <li key={course} className="flex items-center text-sm text-orange-700">
                      <div className="h-2 w-2 rounded-full bg-orange-400 mr-2"></div>
                      {course}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-2">Resumen de hoy</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-gray-500">Ordenes Totales:</div>
                    <div className="text-xl font-bold">12</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-gray-500">Menús:</div>
                    <div className="text-xl font-bold">8</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
