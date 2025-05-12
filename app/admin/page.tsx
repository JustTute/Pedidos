"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { DollarSign, Users, ShoppingBag, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { generateMockOrders } from "@/lib/mock-data"
import { generateMockPayments } from "@/lib/admin-data"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 1. Definimos las claves válidas para itemQuantities
type ItemKey = "main" | "side" | "dessert" | "drink"

// 2. Interfaz de estadísticas
interface Stats {
  totalOrders: number
  totalRevenue: number
  totalStudents: number
  outstandingPayments: number
  mealBreakdown: {
    set: number
    buffet: number
  }
  itemQuantities: Record<ItemKey, number>
  paymentMethods: {
    mercadopago: number
    monthly: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, status } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalStudents: 0,
    outstandingPayments: 0,
    mealBreakdown: {
      set: 0,
      buffet: 0,
    },
    itemQuantities: {
      main: 0,
      side: 0,
      dessert: 0,
      drink: 0,
    },
    paymentMethods: {
      mercadopago: 0,
      monthly: 0,
    },
  })

  // Redirecciones según autenticación/rol
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && user?.role !== "admin") {
      router.push(user?.role === "teacher" ? "/teacher" : "/order")
    } else if (status === "authenticated" && user?.role === "admin") {
      calculateStats()
      setIsLoading(false)
    }
  }, [status, user, router])

  const calculateStats = () => {
    // Mock orders por clase
    const class3AOrders = generateMockOrders("Class 3A", 15)
    const class5BOrders = generateMockOrders("Class 5B", 12)
    const class2COrders = generateMockOrders("Class 2C", 18)
    const class4DOrders = generateMockOrders("Class 4D", 14)
    const allOrders = [...class3AOrders, ...class5BOrders, ...class2COrders, ...class4DOrders]

    const payments = generateMockPayments()

    // Cálculos básicos
    const totalOrders = allOrders.length
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalCost, 0)
    const totalStudents = new Set(allOrders.map((o) => o.childName)).size
    const outstandingPayments = payments.reduce(
      (sum, p) => (p.status === "unpaid" ? sum + p.amount : sum),
      0,
    )

    // Breakdown de comidas
    const setCount = allOrders.filter((o) => o.mealType === "set").length
    const buffetCount = allOrders.filter((o) => o.mealType === "buffet").length

    // Cantidades por ítem
    const itemQuantities: Record<ItemKey, number> = {
      main: 0,
      side: 0,
      dessert: 0,
      drink: 0,
    }

    allOrders.forEach((order) => {
      if (order.mealType === "buffet" && order.items) {
        // Forzamos a TS a tratar entries como [ItemKey, number][]
        ;(Object.entries(order.items) as [ItemKey, number][]).forEach(
          ([item, qty]) => {
            itemQuantities[item] += qty
          }
        )
      }
    })

    // Métodos de pago
    const mercadopagoCount = allOrders.filter((o) => o.paymentMethod === "mercadopago").length
    const monthlyCount = allOrders.filter((o) => o.paymentMethod === "monthly").length

    setStats({
      totalOrders,
      totalRevenue,
      totalStudents,
      outstandingPayments,
      mealBreakdown: { set: setCount, buffet: buffetCount },
      itemQuantities,
      paymentMethods: { mercadopago: mercadopagoCount, monthly: monthlyCount },
    })
  }

  if (status === "loading" || isLoading) {
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
              <CardTitle className="text-2xl font-bold">Panel de Directivos</CardTitle>
            </div>
            <CardDescription>Resumen de pedidos y pagos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-800">Total de Pedidos</p>
                    <h3 className="text-2xl font-bold text-orange-900">{stats.totalOrders}</h3>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-800">Ganado</p>
                    <h3 className="text-2xl font-bold text-green-900">${stats.totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-800">Estudiantes</p>
                    <h3 className="text-2xl font-bold text-blue-900">{stats.totalStudents}</h3>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-800">En cuota</p>
                    <h3 className="text-2xl font-bold text-red-900">${stats.outstandingPayments.toFixed(2)}</h3>
                  </div>
                  <Link href="/admin/payments">
                    <div className="bg-red-100 p-2 rounded-full">
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <Tabs defaultValue="meals" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="meals">Resumen Pedidos</TabsTrigger>
                <TabsTrigger value="payments">Resumen Pagos</TabsTrigger>
              </TabsList>

              <TabsContent value="meals" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tipo de Pedido</span>
                    <span>{stats.mealBreakdown.set + stats.mealBreakdown.buffet} total</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Menu</span>
                      <span>
                        {stats.mealBreakdown.set} ({Math.round((stats.mealBreakdown.set / stats.totalOrders) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(stats.mealBreakdown.set / stats.totalOrders) * 100} className="h-2" />

                    <div className="flex justify-between text-xs">
                      <span>Buffet</span>
                      <span>
                        {stats.mealBreakdown.buffet} (
                        {Math.round((stats.mealBreakdown.buffet / stats.totalOrders) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(stats.mealBreakdown.buffet / stats.totalOrders) * 100} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cantidades de alimentos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(stats.itemQuantities).map(([item, quantity]) => (
                      <div key={item} className="bg-gray-50 p-2 rounded border text-xs">
                        <div className="capitalize">{item}</div>
                        <div className="font-bold">{quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Métodos de Pago</span>
                    <span>{stats.paymentMethods.mercadopago + stats.paymentMethods.monthly} total</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Mercado Pago</span>
                      <span>
                        {stats.paymentMethods.mercadopago} (
                        {Math.round((stats.paymentMethods.mercadopago / stats.totalOrders) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(stats.paymentMethods.mercadopago / stats.totalOrders) * 100} className="h-2" />

                    <div className="flex justify-between text-xs">
                      <span>Cuota</span>
                      <span>
                        {stats.paymentMethods.monthly} (
                        {Math.round((stats.paymentMethods.monthly / stats.totalOrders) * 100)}%)
                      </span>
                    </div>
                    <Progress value={(stats.paymentMethods.monthly / stats.totalOrders) * 100} className="h-2" />
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-800">Lo que falta cobrar por Cuota</h4>
                      <p className="text-sm text-red-700">${stats.outstandingPayments.toFixed(2)} total</p>
                    </div>
                    <Link href="/admin/payments">
                      <Button size="sm" variant="destructive">
                        Mirar Todo
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
