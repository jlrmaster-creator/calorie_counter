import { PORCENTAJE_CERCANO_LIMITE } from "./constantes"
import type { EstadoDia } from "../types"

export function calcularEstadoDia(
  totalCalorias: number,
  objetivo: number
): EstadoDia {
  if (totalCalorias <= objetivo * PORCENTAJE_CERCANO_LIMITE)
    return "dentro_objetivo"
  if (totalCalorias <= objetivo) return "cercano_limite"
  return "exceso"
}

export function obtenerFechaActual(): string {
  const ahora = new Date()
  const year = ahora.getFullYear()
  const month = String(ahora.getMonth() + 1).padStart(2, "0")
  const day = String(ahora.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-")
  return `${day}/${month}/${year}`
}

export function obtenerNombreDia(fecha: string): string {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const date = new Date(fecha + "T12:00:00")
  return dias[date.getDay()]
}
