import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationMenu } from "@/components/navigation-menu"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pedidos Almuerzos Escolares",
  description: "Pedi los almuerzos escolares de manera fácil y rápida",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <div className="pb-16">{children}</div>
            <NavigationMenu />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
