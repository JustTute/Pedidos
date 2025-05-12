import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combines Tailwind CSS classes and handles conflicts
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format date to locale string
export function formatDate(date: Date) {
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

// Format currency
export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount)
}

// Delay function for async operations
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}