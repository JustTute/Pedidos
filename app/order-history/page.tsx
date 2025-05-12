"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import OrderHistoryItem from "@/components/order-history-item"
import type { Order } from "@/types/order"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

export default function OrderHistoryPage() {
  const router = useRouter()
  const { user, status } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && user?.role !== "parent") {
      router.push("/teacher")
    } else {
      // Load order history from localStorage
      const storedOrders = localStorage.getItem("orderHistory")
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders))
      }
      setIsLoading(false)
    }
  }, [status, user, router])

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(order.date).toLocaleDateString().includes(searchTerm),
  )

  if (status === "loading") {
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
            <div className="flex items-center">
              <Link href="/order" passHref>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl font-bold">Historial de Pedidos</CardTitle>
            </div>
            <CardDescription>Mirá lo que pediste anteriormente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre o fecha"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order, index) => (
                    <OrderHistoryItem key={order.id} order={order} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron ordenes.</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {orders.length === 0
                      ? "No ordenaste nada todavía."
                      : "No hay ninguna orden a partir de lo que buscaste."}
                  </p>
                  {orders.length === 0 && (
                    <Button className="mt-4 bg-orange-500 hover:bg-orange-600" asChild>
                      <Link href="/order">Ordená tu primer pedido!</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
