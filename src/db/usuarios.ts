import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore"
import { db } from "../config/firebase"
import type { TipoDieta } from "../types"

interface RegistroPesoData {
  fecha: string
  peso: number
}

interface UsuarioData {
  email: string
  objetivoCalorias: number
  tipoDieta: string | null
  colesterol: boolean
  pesoActual: number | null
  pesoHistorial: RegistroPesoData[]
}

export async function crearUsuario(
  userId: string,
  email: string
): Promise<void> {
  const usuarioRef = doc(db, "usuarios", userId)
  await setDoc(usuarioRef, {
    email,
    objetivoCalorias: 2000,
    tipoDieta: null,
    colesterol: false,
    pesoActual: null,
    pesoHistorial: [],
    creadoEn: serverTimestamp(),
  })
}

export async function obtenerUsuario(userId: string) {
  const usuarioRef = doc(db, "usuarios", userId)
  const snapshot = await getDoc(usuarioRef)
  if (!snapshot.exists()) return null
  const data = snapshot.data() as UsuarioData
  return { id: snapshot.id, ...data }
}

export async function actualizarObjetivo(
  userId: string,
  objetivoCalorias: number
): Promise<void> {
  const usuarioRef = doc(db, "usuarios", userId)
  await updateDoc(usuarioRef, { objetivoCalorias })
}

export async function actualizarDieta(
  userId: string,
  tipoDieta: TipoDieta | null
): Promise<void> {
  const usuarioRef = doc(db, "usuarios", userId)
  await updateDoc(usuarioRef, { tipoDieta })
}

export async function actualizarColesterol(
  userId: string,
  colesterol: boolean
): Promise<void> {
  const usuarioRef = doc(db, "usuarios", userId)
  await updateDoc(usuarioRef, { colesterol })
}

export async function actualizarPeso(
  userId: string,
  peso: number
): Promise<void> {
  const usuarioRef = doc(db, "usuarios", userId)
  const fecha = new Date().toISOString().split("T")[0]
  await updateDoc(usuarioRef, {
    pesoActual: peso,
    pesoHistorial: arrayUnion({ fecha, peso }),
  })
}
