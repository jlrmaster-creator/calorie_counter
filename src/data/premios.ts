import type { PremioDef, PremioId } from "../types"

export const PREMIOS_DEF: PremioDef[] = [
  {
    id: "primer_bocado",
    nombre: "Primer bocado",
    descripcion: "Registra tu primera comida",
    icono: "🍽️",
    estrellas: 1,
  },
  {
    id: "racha_3",
    nombre: "En racha",
    descripcion: "3 días consecutivos registrando comidas",
    icono: "🔥",
    estrellas: 2,
  },
  {
    id: "racha_7",
    nombre: "Racha de hierro",
    descripcion: "7 días consecutivos registrando comidas",
    icono: "⚡",
    estrellas: 5,
  },
  {
    id: "racha_30",
    nombre: "Dedicación total",
    descripcion: "30 días consecutivos registrando comidas",
    icono: "👑",
    estrellas: 10,
  },
  {
    id: "buen_dia",
    nombre: "Buen día",
    descripcion: "Cumple tu objetivo calórico por un día",
    icono: "✅",
    estrellas: 1,
  },
  {
    id: "variedad",
    nombre: "Variedad",
    descripcion: "Usa los 5 tipos de comida (desayuno, almuerzo, comida, merienda, cena)",
    icono: "🌈",
    estrellas: 3,
  },
  {
    id: "control_total",
    nombre: "Control total",
    descripcion: "7 días dentro de tu objetivo calórico",
    icono: "💎",
    estrellas: 5,
  },
]

export const RANGOS_ESTRELLAS = [
  { minimo: 0, icono: "🌱", nombre: "Novato" },
  { minimo: 5, icono: "🥉", nombre: "Bronce" },
  { minimo: 10, icono: "🥈", nombre: "Plata" },
  { minimo: 15, icono: "🥇", nombre: "Oro" },
  { minimo: 20, icono: "💎", nombre: "Diamante" },
  { minimo: 30, icono: "👑", nombre: "Leyenda" },
]

export function obtenerRango(estrellas: number) {
  let rango = RANGOS_ESTRELLAS[0]
  for (const r of RANGOS_ESTRELLAS) {
    if (estrellas >= r.minimo) rango = r
  }
  return rango
}

type FechasComidas = Record<string, boolean>

function obtenerFechasUnicas(comidas: { fecha: string }[]): string[] {
  const set = new Set(comidas.map((c) => c.fecha))
  return [...set].sort()
}

function calcularRacha(
  fechasUnicas: string[],
  hoy: string
): number {
  if (fechasUnicas.length === 0) return 0
  let racha = 0
  const fechaActual = new Date(hoy)
  for (let i = fechasUnicas.length - 1; i >= 0; i--) {
    const fechaStr = fechasUnicas[i]
    const fecha = new Date(fechaStr)
    const diff = Math.round(
      (fechaActual.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diff === racha) {
      racha++
    } else {
      break
    }
  }
  return racha
}

function contarDiasEnObjetivo(
  historial: { fecha: string; totalCalorias: number }[],
  objetivo: number
): number {
  return historial.filter(
    (d) => d.totalCalorias > 0 && d.totalCalorias <= objetivo
  ).length
}

export function verificarPremios(params: {
  comidas: { fecha: string; tipo: string; calorias: number }[]
  historial: { fecha: string; totalCalorias: number }[]
  objetivo: number
  premiosExistentes: string[]
  hoy: string
}): PremioId[] {
  const { comidas, historial, objetivo, premiosExistentes, hoy } = params
  const nuevos: PremioId[] = []
  const fechasUnicas = obtenerFechasUnicas(comidas)
  const totalComidas = comidas.length

  if (
    !premiosExistentes.includes("primer_bocado") &&
    totalComidas >= 1
  ) {
    nuevos.push("primer_bocado")
  }

  const racha = calcularRacha(fechasUnicas, hoy)
  if (!premiosExistentes.includes("racha_3") && racha >= 3) {
    nuevos.push("racha_3")
  }
  if (!premiosExistentes.includes("racha_7") && racha >= 7) {
    nuevos.push("racha_7")
  }
  if (!premiosExistentes.includes("racha_30") && racha >= 30) {
    nuevos.push("racha_30")
  }

  const tiposUsados = new Set(comidas.map((c) => c.tipo))
  if (!premiosExistentes.includes("variedad") && tiposUsados.size >= 5) {
    nuevos.push("variedad")
  }

  const diasEnObjetivo = contarDiasEnObjetivo(historial, objetivo)
  const hoyEnObjetivo = historial.find(
    (d) => d.fecha === hoy && d.totalCalorias > 0 && d.totalCalorias <= objetivo
  )

  if (!premiosExistentes.includes("buen_dia") && hoyEnObjetivo) {
    nuevos.push("buen_dia")
  }
  if (!premiosExistentes.includes("control_total") && diasEnObjetivo >= 7) {
    nuevos.push("control_total")
  }

  return nuevos
}
