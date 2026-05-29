import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { db } from "../config/firebase"
import type { Comida, TipoComida } from "../types"

function comidasRef(userId: string) {
  return collection(db, "usuarios", userId, "comidas")
}

export async function agregarComida(
  userId: string,
  comida: Omit<Comida, "id" | "creadoEn">
): Promise<string> {
  const ref = comidasRef(userId)
  const datos = Object.fromEntries(
    Object.entries(comida).filter(([_, v]) => v !== undefined)
  )
  const docRef = await addDoc(ref, {
    ...datos,
    creadoEn: Timestamp.now(),
  })
  return docRef.id
}

export async function obtenerComidasPorFecha(
  userId: string,
  fecha: string
): Promise<Comida[]> {
  const ref = comidasRef(userId)
  const q = query(ref, where("fecha", "==", fecha))
  const snapshot = await getDocs(q)
  const comidas = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      tipo: data.tipo as TipoComida,
      calorias: data.calorias as number,
      fecha: data.fecha as string,
      creadoEn: (data.creadoEn as Timestamp).toMillis(),
      nota: data.nota as string | undefined,
    } as Comida
  })
  comidas.sort((a, b) => a.creadoEn - b.creadoEn)
  return comidas
}

export async function obtenerComidasPorRango(
  userId: string,
  fechaInicio: string,
  fechaFin: string
): Promise<Comida[]> {
  const ref = comidasRef(userId)
  const q = query(
    ref,
    where("fecha", ">=", fechaInicio),
    where("fecha", "<=", fechaFin)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      tipo: data.tipo as TipoComida,
      calorias: data.calorias as number,
      fecha: data.fecha as string,
      creadoEn: (data.creadoEn as Timestamp).toMillis(),
      nota: data.nota as string | undefined,
    } as Comida
  })
}

export async function eliminarComida(
  userId: string,
  comidaId: string
): Promise<void> {
  const ref = doc(db, "usuarios", userId, "comidas", comidaId)
  await deleteDoc(ref)
}

export async function actualizarComida(
  userId: string,
  comidaId: string,
  datos: Partial<Pick<Comida, "calorias" | "tipo" | "nota">>
): Promise<void> {
  const ref = doc(db, "usuarios", userId, "comidas", comidaId)
  await updateDoc(ref, datos)
}
