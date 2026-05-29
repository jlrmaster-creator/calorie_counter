import { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Dimensions,
} from "react-native"
import { collection, query, where, getDocs } from "firebase/firestore"
import { LineChart } from "react-native-chart-kit"
import { db } from "../../src/config/firebase"
import { auth } from "../../src/config/firebase"
import { obtenerNombreDia, formatearFecha } from "../../src/utils/calculos"
import Grafico from "../../src/components/Grafico"
import { useStore } from "../../src/store/useStore"
import type { Comida } from "../../src/types"

export default function HistorialScreen() {
  const usuario = useStore((s) => s.usuario)
  const [datosSemana, setDatosSemana] = useState<number[]>([])
  const [diasSemana, setDiasSemana] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)
  const [refrescando, setRefrescando] = useState(false)

  const pesoHistorial = useMemo(() => {
    const h = usuario?.pesoHistorial || []
    return h.slice(-7)
  }, [usuario?.pesoHistorial])

  const pesoLabels = useMemo(
    () => pesoHistorial.map((r) => formatearFecha(r.fecha)),
    [pesoHistorial]
  )
  const pesoData = useMemo(
    () => pesoHistorial.map((r) => r.peso),
    [pesoHistorial]
  )

  const tendenciaPeso = useMemo(() => {
    if (pesoData.length < 2) return null
    const diff = pesoData[pesoData.length - 1] - pesoData[0]
    if (diff < 0) return { icono: "🎉", texto: `Has perdido ${Math.abs(diff).toFixed(1)} kg esta semana` }
    if (diff > 0) return { icono: "⚠️", texto: `Has ganado ${diff.toFixed(1)} kg esta semana` }
    return { icono: "⏸️", texto: "Tu peso se mantiene esta semana" }
  }, [pesoData])

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
      const q = query(mealsRef, where("fecha", "==", fechaStr))
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

  function exportarCSV() {
    if (typeof document === "undefined") return
    let csv = "Día,Calorías\n"
    for (let i = 0; i < diasSemana.length; i++) {
      csv += `${diasSemana[i]},${datosSemana[i]}\n`
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "historial_calorias.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
      refreshControl={
        <RefreshControl
          refreshing={refrescando}
          onRefresh={async () => {
            setRefrescando(true)
            setCargando(true)
            await cargarSemana()
            setRefrescando(false)
          }}
        />
      }
    >
      <Text style={styles.titulo}>
        Esta semana
      </Text>

      <Grafico
        datos={{ labels: diasSemana, data: datosSemana }}
        color="#3b82f6"
      />

      <View style={styles.resumen}>
        {diasSemana.map((dia, i) => (
          <View key={i} style={styles.fila}>
            <Text style={styles.dia}>
              {dia}
            </Text>
            <Text style={styles.valor}>
              {datosSemana[i]} kcal
            </Text>
          </View>
        ))}
      </View>

      {pesoData.length >= 2 && (
        <>
          <Text style={styles.titulo}>Peso</Text>
          {tendenciaPeso && (
            <Text style={styles.tendencia}>
              {tendenciaPeso.icono} {tendenciaPeso.texto}
            </Text>
          )}
          <LineChart
            data={{
              labels: pesoLabels,
              datasets: [{ data: pesoData }],
            }}
            width={Dimensions.get("window").width - 64}
            height={200}
            yAxisSuffix=" kg"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: () => "#22c55e",
              labelColor: () => "#6b7280",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#22c55e",
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
                stroke: "#f3f4f6",
              },
            }}
            bezier
            style={styles.grafico}
          />
          <View style={styles.resumen}>
            {pesoHistorial.map((r, i) => (
              <View key={i} style={styles.fila}>
                <Text style={styles.dia}>{formatearFecha(r.fecha)}</Text>
                <Text style={styles.valor}>{r.peso} kg</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <Pressable style={styles.botonExportar} onPress={exportarCSV}>
        <Text style={styles.textoBoton}>Exportar CSV</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
  botonExportar: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  tendencia: {
    fontSize: 15,
    fontWeight: "700",
    color: "#22c55e",
    textAlign: "center",
  },
  grafico: {
    borderRadius: 12,
  },
})
