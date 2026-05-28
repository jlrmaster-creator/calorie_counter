import type { DietaInfo, TipoComida, EstadoDia } from "../types"

export const TIPOS_COMIDA: { id: TipoComida; nombre: string; icono: string }[] =
  [
    { id: "desayuno", nombre: "Desayuno", icono: "☀️" },
    { id: "almuerzo", nombre: "Almuerzo", icono: "🌅" },
    { id: "comida", nombre: "Comida", icono: "🌞" },
    { id: "merienda", nombre: "Merienda", icono: "🍪" },
    { id: "cena", nombre: "Cena", icono: "🌙" },
  ]

export const DIETAS: DietaInfo[] = [
  {
    id: "hipocalorica",
    nombre: "Hipocalórica",
    descripcion: "Reducción de calorías para pérdida de peso",
    rangoCalorico: [1200, 1800],
  },
  {
    id: "keto",
    nombre: "Keto",
    descripcion: "Baja en carbohidratos, alta en grasas",
    rangoCalorico: [1400, 2000],
  },
  {
    id: "mediterranea",
    nombre: "Mediterránea",
    descripcion: "Equilibrada, rica en vegetales y aceite de oliva",
    rangoCalorico: [1600, 2200],
  },
  {
    id: "alta_proteinas",
    nombre: "Alta en proteínas",
    descripcion: "Alto contenido proteico para ganancia muscular",
    rangoCalorico: [1800, 2600],
  },
]

export const ESTADO_DIA_CONFIG: Record<
  EstadoDia,
  { color: string; icono: string; mensaje: string }
> = {
  dentro_objetivo: {
    color: "#22c55e",
    icono: "✅",
    mensaje: "¡Vas muy bien!",
  },
  cercano_limite: {
    color: "#eab308",
    icono: "⚠️",
    mensaje: "Cuidado, estás cerca del límite",
  },
  exceso: {
    color: "#ef4444",
    icono: "❌",
    mensaje: "Has excedido tu objetivo",
  },
}

export const PORCENTAJE_CERCANO_LIMITE = 0.85
