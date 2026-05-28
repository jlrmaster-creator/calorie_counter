import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "../../src/config/firebase"
import { auth } from "../../src/config/firebase"
import { obtenerNombreDia } from "../../src/utils/calculos"
import Grafico from "../../src/components/Grafico"
import { useStore } from "../../src/store/useStore"
import type { Comida } from "../../src/types"

export default function HistorialScreen() {
  const [datosSemana, setDatosSemana] = useState<number[]>([])
  const [diasSemana, setDiasSemana] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)
  const modoOscuro = useStore((s) => s.modoOscuro)

  useEffect(() => {
    cargarSemana()
  }, [])

  async function cargarSemana() {
    const user = auth.currentUser
    if (!user) return

    const fechas: string[] = []
    const totals: number[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const fechaStr = `${year}-${month}-${day}`

      fechas.push(obtenerNombreDia(fechaStr))

      const mealsRef = collection(db, "usuarios", user.uid, "comidas")
      const q = query(
        mealsRef,
        where("fecha", "==", fechaStr),
        orderBy("creadoEn", "asc")
      )
      const snapshot = await getDocs(q)
      const total = snapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().calorias as number)
      }, 0)
      totals.push(total)
    }

    setDiasSemana(fechas)
    setDatosSemana(totals)
    setCargando(false)
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.contenedor, modoOscuro && styles.oscuro]}
      contentContainerStyle={styles.contenido}
    >
      <Text style={[styles.titulo, modoOscuro && styles.textoOscuro]}>
        Esta semana
      </Text>

      <Grafico
        datos={{ labels: diasSemana, data: datosSemana }}
        color="#3b82f6"
      />

      <View style={styles.resumen}>
        {diasSemana.map((dia, i) => (
          <View key={i} style={styles.fila}>
            <Text style={[styles.dia, modoOscuro && styles.textoOscuro]}>
              {dia}
            </Text>
            <Text style={[styles.valor, modoOscuro && styles.textoOscuro]}>
              {datosSemana[i]} kcal
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  oscuro: {
    backgroundColor: "#0f172a",
  },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contenido: {
    padding: 24,
    gap: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  textoOscuro: {
    color: "#f1f5f9",
  },
  resumen: {
    gap: 8,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  dia: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  valor: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3b82f6",
  },
})
