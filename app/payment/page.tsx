"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import type { Order } from "@/types/order"

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("mercadopago")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  const handlePayment = () => {
    setIsProcessing(true)

    // Get order details from localStorage
    const orderDetails = localStorage.getItem("orderDetails")

    if (orderDetails) {
      const details = JSON.parse(orderDetails)

      // Create a complete order object
      const order: Order = {
        id: "ORD-" + Math.floor(Math.random() * 10000),
        childName: details.childName,
        date: details.date,
        mealType: details.mealType,
        items: details.mealType === "buffet" ? details.buffetItems : undefined,
        totalCost: details.totalCost,
        paymentMethod: paymentMethod as "mercadopago" | "monthly",
      }

      // Save current order to localStorage
      localStorage.setItem("currentOrder", JSON.stringify(order))
    }

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      // Redirect to confirmation after showing success animation
      setTimeout(() => {
        router.push("/confirmation")
      }, 2000)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {isComplete ? (
          <motion.div
            className="flex flex-col items-center justify-center p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-center">Pago Exitoso!</h2>
            <p className="text-gray-500 text-center mt-2">Redirijiendo a la confirmación...</p>
          </motion.div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Método de Pago</CardTitle>
              <CardDescription>Elige como te gustaria pagar el pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="mercadopago" id="mercadopago" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="mercadopago" className="font-medium">
                        Mercado Pago
                      </Label>
                      <p className="text-sm text-gray-500">Pagar usando Mercado Pago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="monthly" className="font-medium">
                        Cuota Escolar
                      </Label>
                      <p className="text-sm text-gray-500">Se agrega a la cuota escolar</p>
                    </div>
                  </div>
                </RadioGroup>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Procesando...
                    </div>
                  ) : (
                    "Complete Payment"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
