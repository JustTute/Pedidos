import { useState } from "react"
import { motion } from "framer-motion"

interface BuffetSelectionProps {
  onItemChange: (item: string, quantity: number) => void
}

interface BuffetItem {
  id: string
  name: string
  price: number
  max: number
}

export default function BuffetSelection({ onItemChange }: BuffetSelectionProps) {
  const buffetItems: BuffetItem[] = [
    { id: "main", name: "Empanadas", price: 5.0, max: 1 },
    { id: "side", name: "Tarta de JQ", price: 2.5, max: 2 },
    { id: "dessert", name: "Sandwich Pan Francés Milanesa Completo", price: 2.0, max: 1 },
    { id: "drink", name: "Pizzeta", price: 1.5, max: 1 },
  ]

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    main: 0,
    side: 0,
    dessert: 0,
    drink: 0,
  })

  const handleQuantityChange = (id: string, value: number, max: number) => {
    // Ensure value is within bounds
    const newValue = Math.max(0, Math.min(value, max))

    setQuantities((prev) => {
      const updated = { ...prev, [id]: newValue }
      onItemChange(id, newValue)
      return updated
    })
  }

  return (
    <div className="space-y-4 py-2">
      <div className="text-sm font-medium mb-2">Selecciona lo que quiere de Buffet:</div>

      {buffetItems.map((item, index) => (
        <motion.div
          key={item.id}
          className="flex items-center justify-between p-3 border rounded-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500">
              ${item.price.toFixed(2)} cada uno (max: {item.max})
            </div>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full border"
              onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1, item.max)}
              disabled={quantities[item.id] <= 0}
            >
              -
            </button>
            <span className="w-8 text-center">{quantities[item.id]}</span>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full border"
              onClick={() => handleQuantityChange(item.id, quantities[item.id] + 1, item.max)}
              disabled={quantities[item.id] >= item.max}
            >
              +
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
