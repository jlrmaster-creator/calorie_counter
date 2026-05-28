import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { db } from "../config/firebase"
import type { Premio, PremioId } from "../types"

function premiosRef(userId: string) {
  return collection(db, "usuarios", userId, "premios")
}

export async function obtenerPremios(userId: string): Promise<Premio[]> {
  const snapshot = await getDocs(premiosRef(userId))
  return snapshot.docs.map((doc) => ({
    id: doc.data().id as PremioId,
    desbloqueadoEn: (doc.data().desbloqueadoEn as Timestamp).toMillis(),
  }))
}

export async function agregarPremio(
  userId: string,
  premioId: PremioId
): Promise<void> {
  await addDoc(premiosRef(userId), {
    id: premioId,
    desbloqueadoEn: Timestamp.now(),
  })
}

export async function eliminarPremio(
  userId: string,
  premioId: string
): Promise<void> {
  const snapshot = await getDocs(premiosRef(userId))
  const docSnap = snapshot.docs.find((d) => d.data().id === premioId)
  if (docSnap) {
    await deleteDoc(doc(db, "usuarios", userId, "premios", docSnap.id))
  }
}
