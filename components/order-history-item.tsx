import { motion } from "framer-motion"
import { Package, Utensils } from "lucide-react"
import { useState } from "react"
import type { Order } from "@/types/order"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"

interface OrderHistoryItemProps {
  order: Order
  index: number
}

export default function OrderHistoryItem({ order, index }: OrderHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="border rounded-lg overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={toggleExpand}>
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-full">
            {order.mealType === "set" ? (
              <Package className="h-5 w-5 text-orange-500" />
            ) : (
              <Utensils className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{order.childName}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {formatDate(order.date)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="font-bold">${order.totalCost.toFixed(2)}</span>
            <Badge variant="outline" className="ml-2">
              {order.mealType === "set" ? "Set Menu" : "Buffet"}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      <div
        className={cn(
          "px-4 overflow-hidden transition-all duration-300 ease-in-out bg-gray-50",
          isExpanded ? "max-h-96 py-4" : "max-h-0 py-0",
        )}
      >
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-medium">#{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Método de Pago:</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>

          {order.mealType === "buffet" && order.items && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quiere:</h4>
              <ul className="space-y-1">
                {Object.entries(order.items).map(
                  ([item, quantity]) =>
                    quantity > 0 && (
                      <li key={item} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.charAt(0).toUpperCase() + item.slice(1)}:</span>
                        <span className="font-medium">x{quantity}</span>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
