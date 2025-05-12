"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { Filter, Download, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { generateMockPayments, type PaymentRecord } from "@/lib/admin-data"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ArrowLeftIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function AdminPaymentsPage() {
  const router = useRouter()
  const { user, status } = useAuth()
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<string[]>([])

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && user?.role !== "admin") {
      if (user?.role === "teacher") {
        router.push("/teacher")
      } else {
        router.push("/order")
      }
    } else if (status === "authenticated" && user?.role === "admin") {
      // Load mock payment data
      const mockPayments = generateMockPayments()
      setPayments(mockPayments)

      // Extract unique courses
      const uniqueCourses = Array.from(new Set(mockPayments.map((p) => p.course)))
      setCourses(uniqueCourses)

      setIsLoading(false)
    }
  }, [status, user, router])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...payments]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.parentName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply course filter
    if (courseFilter !== "all") {
      result = result.filter((payment) => payment.course === courseFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((payment) => payment.status === statusFilter)
    }

    // Apply payment method filter
    if (paymentMethodFilter !== "all") {
      result = result.filter((payment) => payment.paymentMethod === paymentMethodFilter)
    }

    setFilteredPayments(result)
  }, [payments, searchTerm, courseFilter, statusFilter, paymentMethodFilter])

  const getTotalOutstanding = () => {
    return filteredPayments
      .filter((payment) => payment.status === "unpaid")
      .reduce((sum, payment) => sum + payment.amount, 0)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setCourseFilter("all")
    setStatusFilter("all")
    setPaymentMethodFilter("all")
  }

  const handleExport = () => {
    alert("Exportando datos de pago...")
    // In a real app, this would generate a CSV or PDF file
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
            <div className="flex items-center">
              <Link href="/admin" passHref>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-xl font-bold">Manego de Pagos</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Manejá los pedidos pagados por cuota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="font-medium text-red-800">Cuotas</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-2xl font-bold text-red-900">${getTotalOutstanding().toFixed(2)}</p>
                  <Badge variant="outline" className="bg-white">
                    {filteredPayments.filter((p) => p.status === "unpaid").length} estudiantes
                  </Badge>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by name..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="flex-1 h-9">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los cursos.</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Estado de Pago</h4>
                          <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="status-all"
                                checked={statusFilter === "all"}
                                onCheckedChange={() => setStatusFilter("all")}
                              />
                              <Label htmlFor="status-all">Todo</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="status-paid"
                                checked={statusFilter === "paid"}
                                onCheckedChange={() => setStatusFilter("paid")}
                              />
                              <Label htmlFor="status-paid">Pagado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="status-unpaid"
                                checked={statusFilter === "unpaid"}
                                onCheckedChange={() => setStatusFilter("unpaid")}
                              />
                              <Label htmlFor="status-unpaid">Falta cobrar</Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Metodo de Pago</h4>
                          <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="method-all"
                                checked={paymentMethodFilter === "all"}
                                onCheckedChange={() => setPaymentMethodFilter("all")}
                              />
                              <Label htmlFor="method-all">Todo</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="method-mercadopago"
                                checked={paymentMethodFilter === "mercadopago"}
                                onCheckedChange={() => setPaymentMethodFilter("mercadopago")}
                              />
                              <Label htmlFor="method-mercadopago">Mercado Pago</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="method-monthly"
                                checked={paymentMethodFilter === "monthly"}
                                onCheckedChange={() => setPaymentMethodFilter("monthly")}
                              />
                              <Label htmlFor="method-monthly">Por Cuota</Label>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full" onClick={handleClearFilters}>
                          Borra Filtros
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Payment List */}
              {filteredPayments.length > 0 ? (
                <div className="space-y-3">
                  {filteredPayments.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "border rounded-lg p-3",
                        payment.status === "unpaid" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50",
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{payment.studentName}</h3>
                          <p className="text-xs text-gray-500">Padre: {payment.parentName}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs mr-2">
                              {payment.course}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {payment.paymentMethod === "mercadopago" ? "Mercado Pago" : "Monthly Fees"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            {payment.status === "paid" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span
                              className={cn(
                                "text-sm font-medium",
                                payment.status === "paid" ? "text-green-600" : "text-red-600",
                              )}
                            >
                              {payment.status === "paid" ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                          <p className="text-lg font-bold mt-1">${payment.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Due: {payment.dueDate}</p>
                        </div>
                      </div>

                      {payment.status === "unpaid" && (
                        <div className="mt-2 pt-2 border-t border-red-200">
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            Marcar como Pagado
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payments found matching your filters.</p>
                  <Button variant="link" onClick={handleClearFilters}>
                    Borrar Filtros
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
