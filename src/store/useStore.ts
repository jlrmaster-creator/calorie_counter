import { create } from "zustand"
import type { Comida, Usuario, TipoDieta, TipoComida } from "../types"
import { obtenerFechaActual, calcularEstadoDia } from "../utils/calculos"
import { obtenerComidasPorFecha, agregarComida, eliminarComida } from "../db/comidas"
import { obtenerUsuario, actualizarObjetivo, actualizarDieta } from "../db/usuarios"

interface AppState {
  usuario: Usuario | null
  comidas: Comida[]
  cargando: boolean

  setUsuario: (usuario: Usuario | null) => void
  cargarComidas: (userId: string, fecha?: string) => Promise<void>
  anadirComida: (userId: string, tipo: TipoComida, calorias: number, fecha: string) => Promise<void>
  borrarComida: (userId: string, comidaId: string) => Promise<void>
  cambiarObjetivo: (userId: string, objetivo: number) => Promise<void>
  cambiarDieta: (userId: string, dieta: TipoDieta | null) => Promise<void>
  inicializarDesdeFirebase: (userId: string) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  usuario: null,
  comidas: [],
  cargando: true,

  setUsuario: (usuario) => set({ usuario }),

  cargarComidas: async (userId, fecha) => {
    try {
      const fechaActiva = fecha || obtenerFechaActual()
      const comidas = await obtenerComidasPorFecha(userId, fechaActiva)
      set({ comidas })
    } catch (e) {
      console.error("Error al cargar comidas:", e)
      set({ comidas: [] })
    }
  },

  anadirComida: async (userId, tipo, calorias, fecha) => {
    await agregarComida(userId, {
      tipo,
      calorias,
      fecha,
    })
    await get().cargarComidas(userId, fecha)
  },

  borrarComida: async (userId, comidaId) => {
    await eliminarComida(userId, comidaId)
    await get().cargarComidas(userId)
  },

  cambiarObjetivo: async (userId, objetivo) => {
    await actualizarObjetivo(userId, objetivo)
    const usuario = get().usuario
    if (usuario) {
      set({ usuario: { ...usuario, objetivoCalorias: objetivo } })
    }
  },

  cambiarDieta: async (userId, dieta) => {
    await actualizarDieta(userId, dieta)
    const usuario = get().usuario
    if (usuario) {
      set({ usuario: { ...usuario, tipoDieta: dieta } })
    }
  },

  inicializarDesdeFirebase: async (userId) => {
    set({ cargando: true })
    try {
      const data = await obtenerUsuario(userId)
      if (data) {
        set({
          usuario: {
            id: data.id,
            email: data.email,
            objetivoCalorias: data.objetivoCalorias,
            tipoDieta: data.tipoDieta as TipoDieta | null,
          },
        })
      }
      await get().cargarComidas(userId)
    } catch (e) {
      console.error("Error al inicializar desde Firebase:", e)
    } finally {
      set({ cargando: false })
    }
  },
}))

export function calcularTotalCalorias(comidas: Comida[]): number {
  return comidas.reduce((sum, c) => sum + c.calorias, 0)
}
