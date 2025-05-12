"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, Home } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import type { Order } from "@/types/order"

export default function ConfirmationPage() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)

  // Check authentication and get order details
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      // Get current order from localStorage
      const currentOrder = localStorage.getItem("currentOrder")
      if (currentOrder) {
        setOrder(JSON.parse(currentOrder))

        // Add to order history
        const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
        orderHistory.unshift(JSON.parse(currentOrder)) // Add to beginning of array
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory))

        // Clear current order
        localStorage.removeItem("currentOrder")
      }

      // Trigger confetti animation on successful order
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Pedido Confirmado!</CardTitle>
            <CardDescription className="text-center">Tu orden se a registrado con éxito!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Resumen del Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Orden ID:</span>
                  <span className="font-medium">#{order?.id || "ORD-" + Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Día:</span>
                  <span className="font-medium">
                    {order?.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Método de Pago:</span>
                  <span className="font-medium">{order?.paymentMethod || "Mercado Pago"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium">${order?.totalCost.toFixed(2) || "8.50"}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Cualquier duda, consultar a los directivos.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Link href="/order" className="w-full">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <Home className="mr-2 h-4 w-4" />
                Realizar otro pedido
              </Button>
            </Link>
            <Link href="/order-history" className="w-full">
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Mirar historial de pedidos
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
