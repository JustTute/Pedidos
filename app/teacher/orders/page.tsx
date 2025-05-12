"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { generateMockOrders } from "@/lib/mock-data"
import type { Order } from "@/types/order"
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

export default function TeacherOrdersPage() {
  const router = useRouter()
  const { user, status } = useAuth()
  const [activeClass, setActiveClass] = useState<string>("")
  const [orders, setOrders] = useState<{ [course: string]: Order[] }>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && user?.role !== "teacher") {
      router.push("/order")
    } else if (status === "authenticated" && user?.role === "teacher" && user.courses?.length) {
      // Set active class to first course
      setActiveClass(user.courses[0])

      // Generate mock orders for each course
      const mockOrders: { [course: string]: Order[] } = {}
      user.courses.forEach((course) => {
        mockOrders[course] = generateMockOrders(course, 8)
      })
      setOrders(mockOrders)
      setIsLoading(false)
    }
  }, [status, user, router])

  // Filter orders based on search term
  const filteredOrders =
    activeClass && orders[activeClass]
      ? orders[activeClass].filter(
          (order) =>
            order.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(order.date).toLocaleDateString().includes(searchTerm),
        )
      : []

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
              <Link href="/teacher" passHref>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-xl font-bold">Ordenes de los estudiantes</CardTitle>
              <div className="w-8"></div> {/* Empty div for flex alignment */}
            </div>
            <CardDescription>Mirar los pedidos de tus clases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {user.courses && user.courses.length > 0 && (
                <Tabs
                  defaultValue={user.courses[0]}
                  value={activeClass}
                  onValueChange={setActiveClass}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    {user.courses.map((course) => (
                      <TabsTrigger key={course} value={course}>
                        {course}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {user.courses.map((course) => (
                    <TabsContent key={course} value={course} className="mt-4 space-y-4">
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Buscar por nombre del estudiante"
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {isLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-md"></div>
                          ))}
                        </div>
                      ) : filteredOrders.length > 0 ? (
                        <div className="space-y-3">
                          {filteredOrders.map((order) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{order.childName}</h3>
                                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant={order.mealType === "set" ? "outline" : "secondary"}>
                                    {order.mealType === "set" ? "Set Menu" : "Buffet"}
                                  </Badge>
                                  <p className="text-sm font-bold mt-1">${order.totalCost.toFixed(2)}</p>
                                </div>
                              </div>

                              {order.mealType === "buffet" && order.items && (
                                <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                                  <p className="font-medium mb-1">Quiere:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(order.items).map(
                                      ([item, quantity]) =>
                                        quantity > 0 && (
                                          <span key={item} className="bg-gray-100 px-2 py-0.5 rounded">
                                            {item} x{quantity}
                                          </span>
                                        ),
                                    )}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Hoy no se encontraron ordenes para esta clase.</p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
