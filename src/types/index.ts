export type TipoComida = "desayuno" | "almuerzo" | "comida" | "merienda" | "cena"

export type EstadoDia = "dentro_objetivo" | "cercano_limite" | "exceso"

export type TipoDieta = "hipocalorica" | "keto" | "mediterranea" | "alta_proteinas"

export interface Comida {
  id: string
  tipo: TipoComida
  calorias: number
  fecha: string
  creadoEn: number
  nota?: string
}

export interface RegistroDiario {
  fecha: string
  totalCalorias: number
  estado: EstadoDia
}

export interface Usuario {
  id: string
  email: string
  objetivoCalorias: number
  tipoDieta: TipoDieta | null
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
