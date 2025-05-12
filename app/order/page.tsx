"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import BuffetSelection from "@/components/buffet-selection"
import { useAuth } from "@/components/auth-provider"

export default function OrderPage() {
  const router = useRouter()
  const { user, status } = useAuth()
  const [childName, setChildName] = useState("")
  const [date, setDate] = useState<Date>()
  const [mealType, setMealType] = useState("set")
  const [totalCost, setTotalCost] = useState(0)
  const [buffetItems, setBuffetItems] = useState<{ [key: string]: number }>({})
  const [formValid, setFormValid] = useState(false)
  

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && user?.role !== "parent") {
      router.push("/teacher")
    }
  }, [status, user, router])

  // Calculate total cost whenever relevant state changes
  useEffect(() => {
    let cost = 0
    if (mealType === "set") {
      cost = 8.5 // Set menu price
    } else {
      // Calculate buffet cost based on selected items
      Object.entries(buffetItems).forEach(([item, quantity]) => {
        const itemPrices: { [key: string]: number } = {
          main: 5.0,
          side: 2.5,
          dessert: 2.0,
          drink: 1.5,
        }
        cost += itemPrices[item] * quantity
      })
    }
    setTotalCost(cost)
  }, [mealType, buffetItems])

  // Validate form
  useEffect(() => {
    if (childName.trim() && date) {
      if (mealType === "set") {
        setFormValid(true)
      } else {
        // Check if at least one buffet item is selected
        const hasItems = Object.values(buffetItems).some((quantity) => quantity > 0)
        setFormValid(hasItems)
      }
    } else {
      setFormValid(false)
    }
  }, [childName, date, mealType, buffetItems])

  const handleBuffetItemChange = (item: string, quantity: number) => {
    setBuffetItems((prev) => ({
      ...prev,
      [item]: quantity,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save order details to localStorage
    const orderDetails = {
      childName,
      date: date?.toISOString(),
      mealType,
      buffetItems: mealType === "buffet" ? buffetItems : {},
      totalCost,
    }

    localStorage.setItem("orderDetails", JSON.stringify(orderDetails))
    router.push("/payment")
  }


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
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Pedí el Almuerzo de tu hijo</CardTitle>
            </div>
            <CardDescription>Rellena la siguiente información:</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="childName">Nombre de tu hijo/a</Label>
                <Input
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Escribe el nombre"
                  required
                />
              </div>

              <div className="space-y-2">
  <Label>Día</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Seleccionar Fecha</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(d) => {
          if (d) setDate(d)
        }}
      />
    </PopoverContent>
  </Popover>
</div>


              <div className="space-y-2">
                <Label>Opciones:</Label>
                <div><br /></div>
                <RadioGroup value={mealType} onValueChange={setMealType} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="set" id="set" />
                    <Label htmlFor="set" className="font-normal">
                      Menú ($12,500)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buffet" id="buffet" />
                    <Label htmlFor="buffet" className="font-normal">
                      Buffet (Elegí lo que quieras)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <AnimatePresence>
                {mealType === "buffet" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BuffetSelection onItemChange={handleBuffetItemChange} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={!formValid}>
                Continuar con el Pago
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
