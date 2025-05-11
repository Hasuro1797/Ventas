import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {format} from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-PE",{
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount)
}

//format date to dd/MM/yyyy
export function formatDate(date:string) {
  return format(new Date(date), "dd/MM/yyyy") 
}

export const languages = [
  { value: "es", label: "Español", id: 1 },
  { value: "en", label: "Inglés", id: 2 },
  { value: "pt", label: "Portugués", id: 3 },
  { value: "fr", label: "Francés", id: 4 },
  { value: "de", label: "Alemán", id: 5 },
  { value: "it", label: "Italiano", id: 6 },
  { value: "ja", label: "Japonés", id: 7 },
  { value: "zh", label: "Chino", id: 8 },
]

export const paidMethods = [
  { value: "credit_card", label: "Tarjeta de crédito", id: 1 },
  { value: "debit_card", label: "Tarjeta de débito", id: 2 },
  { value: "paypal", label: "PayPal", id: 3 },
  { value: "bank_transfer", label: "Transferencia bancaria", id: 4 },
  { value: "cash", label: "Efectivo", id: 5 },
  { value: "check", label: "Cheque", id: 6 },
  { value: "cryptocurrency", label: "Criptomoneda", id: 7 },
]