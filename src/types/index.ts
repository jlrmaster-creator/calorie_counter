export type TipoComida = "desayuno" | "almuerzo" | "comida" | "merienda" | "cena" | "tapas"

export type EstadoDia = "dentro_objetivo" | "cercano_limite" | "exceso"

export type TipoDieta = "hipocalorica" | "keto" | "mediterranea" | "alta_proteinas"

export interface Comida {
  id: string
  tipo: TipoComida
  calorias: number
  fecha: string
  creadoEn: number
  nota?: string
  alimentos?: AlimentoEnComida[]
}

export interface AlimentoEnComida {
  nombre: string
  categoria: string
  calorias: number
  gramos: number
}

export interface RegistroDiario {
  fecha: string
  totalCalorias: number
  estado: EstadoDia
}

export interface RegistroPeso {
  fecha: string
  peso: number
}

export interface Usuario {
  id: string
  email: string
  objetivoCalorias: number
  tipoDieta: TipoDieta | null
  colesterol: boolean
  pesoActual: number | null
  pesoHistorial: RegistroPeso[]
}

export type PremioId =
  | "primer_bocado"
  | "racha_3"
  | "racha_7"
  | "racha_30"
  | "buen_dia"
  | "variedad"
  | "control_total"

export interface Premio {
  id: PremioId
  desbloqueadoEn: number
}

export interface PremioDef {
  id: PremioId
  nombre: string
  descripcion: string
  icono: string
  estrellas: number
}

export interface EjercicioDef {
  id: string
  nombre: string
  kcalPorMinuto: number
  icono: string
}

export interface RegistroEjercicio {
  id: string
  ejercicioId: string
  nombre: string
  minutos: number
  calorias: number
  fecha: string
  creadoEn: number
}

export interface DietaInfo {
  id: TipoDieta
  nombre: string
  descripcion: string
  rangoCalorico: [number, number]
}

export interface StoreState {
  usuario: Usuario | null
  fechaActiva: string
  comidas: Comida[]
  registroDiario: RegistroDiario | null
  cargando: boolean
}
