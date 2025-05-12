export interface PaymentRecord {
  id: string
  studentName: string
  parentName: string
  course: string
  amount: number
  status: "paid" | "unpaid"
  paymentMethod: "mercadopago" | "monthly"
  dueDate: string
}

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

// List of parent names for mock data
const parentNames = [
  "Michael Thompson",
  "Maria Garcia",
  "Jennifer Martinez",
  "Robert Johnson",
  "Sarah Williams",
  "David Brown",
  "Jessica Davis",
  "James Miller",
  "Emily Wilson",
  "John Taylor",
  "Lisa Anderson",
  "Daniel Thomas",
  "Patricia Moore",
  "Christopher Jackson",
  "Elizabeth White",
]

// List of courses
const courses = ["Class 1A", "Class 2B", "Class 3A", "Class 4B", "Class 5A"]

// Function to generate a random due date (within the next 30 days)
const getRandomDueDate = () => {
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30))
  return futureDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Function to generate mock payment records
export const generateMockPayments = (): PaymentRecord[] => {
  const payments: PaymentRecord[] = []

  // Generate 25 payment records
  for (let i = 0; i < 25; i++) {
    const studentIndex = Math.floor(Math.random() * studentNames.length)
    const course = courses[Math.floor(Math.random() * courses.length)]
    const amount = Math.round((Math.random() * 20 + 5) * 100) / 100 // Random amount between $5 and $25
    const status = Math.random() > 0.4 ? "paid" : "unpaid" // 60% paid, 40% unpaid
    const paymentMethod = Math.random() > 0.5 ? "mercadopago" : "monthly"

    payments.push({
      id: `payment-${Math.random().toString(36).substr(2, 9)}`,
      studentName: studentNames[studentIndex],
      parentName: parentNames[studentIndex],
      course,
      amount,
      status,
      paymentMethod,
      dueDate: getRandomDueDate(),
    })
  }

  return payments
}
