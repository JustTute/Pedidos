import type { Order } from "@/types/order"

// List of student names for mock data
const studentNames = [
  "Emma Thompson",
  "Noah Garcia",
  "Olivia Martinez",
  "Liam Johnson",
  "Sophia Williams",
  "Jackson Brown",
  "Ava Davis",
  "Lucas Miller",
  "Isabella Wilson",
  "Aiden Taylor",
  "Mia Anderson",
  "Ethan Thomas",
  "Charlotte Moore",
  "Mason Jackson",
  "Amelia White",
]

// Function to generate random date within the last 14 days
const getRandomDate = () => {
  const today = new Date()
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)

  const randomTime = twoWeeksAgo.getTime() + Math.random() * (today.getTime() - twoWeeksAgo.getTime())
  return new Date(randomTime).toISOString()
}

// Function to generate random buffet items
const getRandomBuffetItems = () => {
  return {
    main: Math.random() > 0.3 ? 1 : 0,
    side: Math.floor(Math.random() * 3),
    dessert: Math.random() > 0.5 ? 1 : 0,
    drink: Math.random() > 0.2 ? 1 : 0,
  }
}

// Function to calculate total cost based on meal type and items
const calculateTotalCost = (mealType: "set" | "buffet", items?: { [key: string]: number }) => {
  if (mealType === "set") {
    return 8.5
  }

  let cost = 0
  if (items) {
    const itemPrices: { [key: string]: number } = {
      main: 5.0,
      side: 2.5,
      dessert: 2.0,
      drink: 1.5,
    }

    Object.entries(items).forEach(([item, quantity]) => {
      cost += itemPrices[item] * quantity
    })
  }

  return cost
}

// Function to generate mock orders for a specific class
export const generateMockOrders = (className: string, count: number): Order[] => {
  // Filter student names based on class to ensure consistent data
  const classStudents = studentNames.slice(0, className === "Class 3A" ? 8 : 7)

  const orders: Order[] = []

  for (let i = 0; i < count; i++) {
    const studentName = classStudents[Math.floor(Math.random() * classStudents.length)]
    const mealType = Math.random() > 0.4 ? "set" : "buffet"
    const items = mealType === "buffet" ? getRandomBuffetItems() : undefined
    const totalCost = calculateTotalCost(mealType, items)

    orders.push({
      id: `order-${Math.random().toString(36).substr(2, 9)}`,
      childName: studentName,
      date: getRandomDate(),
      mealType,
      items,
      totalCost,
      paymentMethod: Math.random() > 0.7 ? "monthly" : "mercadopago",
    })
  }

  // Sort by date, newest first
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
