import type { EjercicioDef } from "../types"

export const EJERCICIOS: EjercicioDef[] = [
  { id: "caminar", nombre: "Caminar (5 km/h)", kcalPorMinuto: 3.5, icono: "🚶" },
  { id: "caminar_rapido", nombre: "Caminar rápido (6 km/h)", kcalPorMinuto: 5, icono: "🚶‍♂️" },
  { id: "correr_8", nombre: "Correr (8 km/h)", kcalPorMinuto: 8, icono: "🏃" },
  { id: "correr_10", nombre: "Correr (10 km/h)", kcalPorMinuto: 10, icono: "🏃‍♂️" },
  { id: "bici_16", nombre: "Bicicleta (16 km/h)", kcalPorMinuto: 7, icono: "🚴" },
  { id: "bici_estatica", nombre: "Bicicleta estática", kcalPorMinuto: 6, icono: "🚴‍♂️" },
  { id: "natacion", nombre: "Natación", kcalPorMinuto: 7, icono: "🏊" },
  { id: "pesas", nombre: "Pesas / Musculación", kcalPorMinuto: 5, icono: "🏋️" },
  { id: "yoga", nombre: "Yoga", kcalPorMinuto: 3, icono: "🧘" },
  { id: "eliptica", nombre: "Elíptica", kcalPorMinuto: 8, icono: "🏃‍♀️" },
  { id: "cuerda", nombre: "Saltar cuerda", kcalPorMinuto: 10, icono: "🤸" },
  { id: "pilates", nombre: "Pilates", kcalPorMinuto: 4, icono: "🤸‍♂️" },
  { id: "remo", nombre: "Remo", kcalPorMinuto: 6, icono: "🚣" },
  { id: "crossfit", nombre: "CrossFit / HIIT", kcalPorMinuto: 10, icono: "💪" },
  { id: "futbol", nombre: "Fútbol", kcalPorMinuto: 8, icono: "⚽" },
  { id: "baloncesto", nombre: "Baloncesto", kcalPorMinuto: 7, icono: "🏀" },
  { id: "tenis", nombre: "Tenis", kcalPorMinuto: 7, icono: "🎾" },
  { id: "bailar", nombre: "Bailar", kcalPorMinuto: 5, icono: "💃" },
  { id: "senderismo", nombre: "Senderismo", kcalPorMinuto: 5, icono: "🥾" },
]

export function buscarEjercicios(query: string): EjercicioDef[] {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return EJERCICIOS.filter((e) =>
    e.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q)
  )
}

export function calcularCaloriasEjercicio(ejercicio: EjercicioDef, minutos: number): number {
  return Math.round(ejercicio.kcalPorMinuto * minutos)
}
