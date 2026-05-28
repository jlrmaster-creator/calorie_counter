import { create } from "zustand"
import type { Comida, Usuario, TipoDieta, TipoComida, Premio, PremioId } from "../types"
import { obtenerFechaActual, calcularEstadoDia } from "../utils/calculos"
import {
  obtenerComidasPorFecha,
  obtenerComidasPorRango,
  agregarComida,
  eliminarComida,
} from "../db/comidas"
import { obtenerUsuario, actualizarObjetivo, actualizarDieta } from "../db/usuarios"
import {
  obtenerPremios,
  agregarPremio as agregarPremioDb,
} from "../db/premios"
import { verificarPremios } from "../data/premios"

function sumarDias(fecha: string, dias: number): string {
  const d = new Date(fecha)
  d.setDate(d.getDate() + dias)
  return d.toISOString().split("T")[0]
}

interface AppState {
  usuario: Usuario | null
  comidas: Comida[]
  cargando: boolean
  premios: Premio[]
  nuevosPremios: Premio[]

  setUsuario: (usuario: Usuario | null) => void
  cargarComidas: (userId: string, fecha?: string) => Promise<void>
  anadirComida: (userId: string, tipo: TipoComida, calorias: number, fecha: string, nota?: string) => Promise<void>
  borrarComida: (userId: string, comidaId: string) => Promise<void>
  cambiarObjetivo: (userId: string, objetivo: number) => Promise<void>
  cambiarDieta: (userId: string, dieta: TipoDieta | null) => Promise<void>
  inicializarDesdeFirebase: (userId: string) => Promise<void>
  cargarPremios: (userId: string) => Promise<void>
  limpiarNuevosPremios: () => void
  verificarLogros: (userId: string, fecha: string) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  usuario: null,
  comidas: [],
  cargando: true,
  premios: [],
  nuevosPremios: [],

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

  anadirComida: async (userId, tipo, calorias, fecha, nota) => {
    await agregarComida(userId, {
      tipo,
      calorias,
      fecha,
      nota,
    })
    await get().cargarComidas(userId, fecha)
    await get().verificarLogros(userId, fecha)
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

  cargarPremios: async (userId) => {
    try {
      const premios = await obtenerPremios(userId)
      set({ premios })
    } catch {
      set({ premios: [] })
    }
  },

  limpiarNuevosPremios: () => set({ nuevosPremios: [] }),

  verificarLogros: async (userId, fecha) => {
    try {
      const inicio = sumarDias(fecha, -30)
      const todas = await obtenerComidasPorRango(userId, inicio, fecha)
      const { premios, usuario } = get()

      const fechasUnicas = [...new Set(todas.map((c) => c.fecha))].sort()
      const historial = fechasUnicas.map((f) => {
        const c = todas.filter((x) => x.fecha === f)
        return {
          fecha: f,
          totalCalorias: c.reduce((s, x) => s + x.calorias, 0),
        }
      })

      const nuevos = verificarPremios({
        comidas: todas,
        historial,
        objetivo: usuario?.objetivoCalorias || 2000,
        premiosExistentes: premios.map((p) => p.id),
        hoy: fecha,
      })

      if (nuevos.length > 0) {
        for (const id of nuevos) {
          await agregarPremioDb(userId, id)
        }
        const actualizados = await obtenerPremios(userId)
        set({
          premios: actualizados,
          nuevosPremios: [
            ...get().nuevosPremios,
            ...nuevos.map((id) => ({
              id,
              desbloqueadoEn: Date.now(),
            })),
          ],
        })
      }
    } catch (e) {
      console.error("Error verificando logros:", e)
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
      await Promise.all([
        get().cargarComidas(userId),
        get().cargarPremios(userId),
      ])
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
