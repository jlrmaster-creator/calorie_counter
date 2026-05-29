import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { db } from "../config/firebase"
import type { RegistroEjercicio } from "../types"

function ejerciciosRef(userId: string) {
  return collection(db, "usuarios", userId, "ejercicios")
}

export async function agregarEjercicio(
  userId: string,
  datos: Omit<RegistroEjercicio, "id" | "creadoEn">
): Promise<string> {
  const ref = ejerciciosRef(userId)
  const docRef = await addDoc(ref, {
    ...datos,
    creadoEn: Timestamp.now(),
  })
  return docRef.id
}

export async function obtenerEjerciciosPorFecha(
  userId: string,
  fecha: string
): Promise<RegistroEjercicio[]> {
  const ref = ejerciciosRef(userId)
  const q = query(ref, where("fecha", "==", fecha))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ejercicioId: data.ejercicioId as string,
      nombre: data.nombre as string,
      minutos: data.minutos as number,
      calorias: data.calorias as number,
      fecha: data.fecha as string,
      creadoEn: (data.creadoEn as Timestamp).toMillis(),
    } as RegistroEjercicio
  })
}

export async function obtenerEjerciciosPorRango(
  userId: string,
  fechaInicio: string,
  fechaFin: string
): Promise<RegistroEjercicio[]> {
  const ref = ejerciciosRef(userId)
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
      ejercicioId: data.ejercicioId as string,
      nombre: data.nombre as string,
      minutos: data.minutos as number,
      calorias: data.calorias as number,
      fecha: data.fecha as string,
      creadoEn: (data.creadoEn as Timestamp).toMillis(),
    } as RegistroEjercicio
  })
}

export async function eliminarEjercicio(
  userId: string,
  ejercicioId: string
): Promise<void> {
  const ref = doc(db, "usuarios", userId, "ejercicios", ejercicioId)
  await deleteDoc(ref)
}
