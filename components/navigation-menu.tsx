"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Clock, ClipboardList, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

export function NavigationMenu() {
  const pathname = usePathname()
  const { user, status } = useAuth()

  // Don't show navigation if not authenticated
  if (
    status !== "authenticated" ||
    !user ||
    pathname === "/login" ||
    pathname === "/"
  ) {
    return null
  }

  // Define routes based on user role
  let routes = []

  if (user.role === "admin") {
    routes = [
      { href: "/admin",         label: "Inicio", icon: BarChart3,      active: pathname === "/admin" },
      { href: "/admin/payments",label: "Pagos",  icon: ClipboardList, active: pathname.startsWith("/admin/payments") },
    ]
  } else if (user.role === "teacher") {
    routes = [
      { href: "/teacher",      label: "Inicio",  icon: ClipboardList, active: pathname === "/teacher" },
      { href: "/teacher/orders",label: "Pedidos", icon: Clock,         active: pathname.startsWith("/teacher/orders") },
    ]
  } else /* parent */ {
    routes = [
      { href: "/order",         label: "Pedí Acá",     icon: Home,  active: pathname === "/order" },
      { href: "/order-history", label: "Tus Pedidos",  icon: Clock, active: pathname === "/order-history" },
    ]
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t">
      <div className="flex justify-around">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center py-2 px-4 text-xs",
              route.active ? "text-orange-500" : "text-gray-500"
            )}
          >
            <route.icon className={cn("h-6 w-6 mb-1", route.active ? "text-orange-500" : "text-gray-500")} />
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}