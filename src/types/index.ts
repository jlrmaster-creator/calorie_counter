export type TipoComida = "desayuno" | "almuerzo" | "comida" | "merienda" | "cena"

export type EstadoDia = "dentro_objetivo" | "cercano_limite" | "exceso"

export type TipoDieta = "hipocalorica" | "keto" | "mediterranea" | "alta_proteinas"

export interface Comida {
  id: string
  tipo: TipoComida
  calorias: number
  fecha: string
  creadoEn: number
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
