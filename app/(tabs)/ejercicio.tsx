import { useState, useMemo } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native"
import { useStore, calcularTotalEjercicios } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { obtenerFechaActual } from "../../src/utils/calculos"
import { EJERCICIOS, calcularCaloriasEjercicio } from "../../src/data/ejercicios"
import type { EjercicioDef } from "../../src/types"

export default function EjercicioScreen() {
  const usuario = useStore((s) => s.usuario)
  const ejercicios = useStore((s) => s.ejercicios)
  const cargarEjercicios = useStore((s) => s.cargarEjercicios)
  const anadirEjercicio = useStore((s) => s.anadirEjercicio)
  const borrarEjercicio = useStore((s) => s.borrarEjercicio)
  const [seleccionado, setSeleccionado] = useState<EjercicioDef | null>(null)
  const [minutos, setMinutos] = useState("30")
  const [guardando, setGuardando] = useState(false)

  const fecha = obtenerFechaActual()
  const totalQuemado = calcularTotalEjercicios(ejercicios)
  const caloriasCalculadas = useMemo(() => {
    if (!seleccionado) return 0
    const m = parseInt(minutos, 10) || 0
    return calcularCaloriasEjercicio(seleccionado, m)
  }, [seleccionado, minutos])

  async function handleGuardar() {
    if (!seleccionado) {
      Alert.alert("Selecciona un ejercicio")
      return
    }
    const m = parseInt(minutos, 10)
    if (!m || m < 1 || m > 600) {
      Alert.alert("Error", "Introduce minutos válidos (1-600)")
      return
    }
    setGuardando(true)
    try {
      const user = auth.currentUser!
      await anadirEjercicio(user.uid, seleccionado.id, seleccionado.nombre, m, caloriasCalculadas, fecha)
      setMinutos("30")
      setSeleccionado(null)
    } catch {
      Alert.alert("Error", "No se pudo guardar el ejercicio")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Registrar ejercicio</Text>

      {usuario?.pesoActual && (
        <Text style={styles.pesoInfo}>
          Basado en tu peso de {usuario.pesoActual} kg
        </Text>
      )}

      <Text style={styles.subtitulo}>¿Qué ejercicio hiciste?</Text>
      <View style={styles.listaEjercicios}>
        {EJERCICIOS.map((ej) => {
          const activo = seleccionado?.id === ej.id
          return (
            <Pressable
              key={ej.id}
              style={[styles.ejercicioItem, activo && styles.ejercicioActivo]}
              onPress={() => setSeleccionado(activo ? null : ej)}
            >
              <Text style={styles.ejercicioIcono}>{ej.icono}</Text>
              <View style={styles.ejercicioInfo}>
                <Text style={[styles.ejercicioNombre, activo && styles.textoActivo]}>
                  {ej.nombre}
                </Text>
                <Text style={styles.ejercicioKcal}>
                  {ej.kcalPorMinuto} kcal/min
                </Text>
              </View>
            </Pressable>
          )
        })}
      </View>

      {seleccionado && (
        <>
          <Text style={styles.subtitulo}>Duración</Text>
          <View style={styles.minutosRow}>
            <TextInput
              style={styles.inputMinutos}
              value={minutos}
              onChangeText={setMinutos}
              keyboardType="number-pad"
              placeholder="minutos"
              placeholderTextColor="#94a3b8"
            />
            <Text style={styles.minutosLabel}>minutos</Text>
          </View>

          <View style={styles.resultadoCard}>
            <Text style={styles.resultadoLabel}>Calorías quemadas</Text>
            <Text style={styles.resultadoValor}>{caloriasCalculadas} kcal</Text>
          </View>

          <Pressable
            style={[styles.boton, guardando && styles.botonDesactivado]}
            onPress={handleGuardar}
            disabled={guardando}
          >
            <Text style={styles.textoBoton}>
              {guardando ? "Guardando..." : "Guardar ejercicio"}
            </Text>
          </Pressable>
        </>
      )}

      {ejercicios.length > 0 && (
        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>Ejercicio de hoy</Text>
          <Text style={styles.totalQuemado}>
            🔥 {totalQuemado} kcal quemadas
          </Text>
          {totalQuemado > 0 && (
            <Text style={styles.animo}>
              {totalQuemado >= 300
                ? "💪 ¡Grandísimo esfuerzo!"
                : totalQuemado >= 150
                  ? "🏃 ¡Sigue así!"
                  : "🌱 Todo suma, buen trabajo"}
            </Text>
          )}
          {ejercicios.map((ej, i) => (
            <View key={ej.id} style={styles.fila}>
              <View style={styles.filaInfo}>
                <Text style={styles.filaNombre}>{ej.nombre}</Text>
                <Text style={styles.filaDetalle}>
                  {ej.minutos} min · {ej.calorias} kcal
                </Text>
              </View>
              <Pressable onPress={() => borrarEjercicio(auth.currentUser!.uid, ej.id)}>
                <Text style={styles.eliminar}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {ejercicios.length === 0 && (
        <View style={styles.vacio}>
          <Text style={styles.textoVacio}>No hay ejercicios registrados hoy</Text>
          <Text style={styles.textoVacioSub}>
            ¡Registra tu primer ejercicio!
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contenido: {
    padding: 24,
    gap: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },
  pesoInfo: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  listaEjercicios: {
    gap: 6,
  },
  ejercicioItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  ejercicioActivo: {
    borderColor: "#22c55e",
    backgroundColor: "#f0fdf4",
  },
  ejercicioIcono: {
    fontSize: 24,
  },
  ejercicioInfo: {
    flex: 1,
  },
  ejercicioNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  textoActivo: {
    color: "#16a34a",
  },
  ejercicioKcal: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 1,
  },
  minutosRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputMinutos: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  minutosLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
  },
  resultadoCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  resultadoLabel: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "600",
  },
  resultadoValor: {
    fontSize: 32,
    fontWeight: "800",
    color: "#22c55e",
    marginTop: 4,
  },
  boton: {
    height: 54,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  botonDesactivado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  resumen: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  resumenTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  totalQuemado: {
    fontSize: 20,
    fontWeight: "800",
    color: "#22c55e",
    textAlign: "center",
  },
  animo: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#16a34a",
    marginBottom: 4,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  filaInfo: {
    flex: 1,
  },
  filaNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  filaDetalle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 1,
  },
  eliminar: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "700",
    paddingLeft: 8,
  },
  vacio: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 4,
  },
  textoVacio: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94a3b8",
  },
  textoVacioSub: {
    fontSize: 13,
    color: "#cbd5e1",
  },
})
