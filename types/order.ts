export interface Order {
  id: string
  childName: string
  date: string
  mealType: "set" | "buffet"
  items?: {
    [key: string]: number
  }
  totalCost: number
  paymentMethod: "mercadopago" | "monthly"
}
