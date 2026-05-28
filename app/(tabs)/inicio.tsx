import { useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native"
import { useStore, calcularTotalCalorias } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { obtenerFechaActual } from "../../src/utils/calculos"
import { calcularEstadoDia } from "../../src/utils/calculos"
import BarraProgreso from "../../src/components/BarraProgreso"
import EstadoDia from "../../src/components/EstadoDia"
import TarjetaComida from "../../src/components/TarjetaComida"
import type { EstadoDia as EstadoDiaTipo } from "../../src/types"

export default function InicioScreen() {
  const usuario = useStore((s) => s.usuario)
  const comidas = useStore((s) => s.comidas)
  const cargando = useStore((s) => s.cargando)
  const modoOscuro = useStore((s) => s.modoOscuro)
  const cargarComidas = useStore((s) => s.cargarComidas)
  const inicializarDesdeFirebase = useStore((s) => s.inicializarDesdeFirebase)
  const borrarComida = useStore((s) => s.borrarComida)

  const user = auth.currentUser
  const fechaActiva = obtenerFechaActual()
  const total = calcularTotalCalorias(comidas)
  const objetivo = usuario?.objetivoCalorias || 2000
  const estado = calcularEstadoDia(total, objetivo) as EstadoDiaTipo
  const porcentaje = objetivo > 0 ? (total / objetivo) * 100 : 0

  const colorEstado =
    estado === "dentro_objetivo"
      ? "#22c55e"
      : estado === "cercano_limite"
      ? "#eab308"
      : "#ef4444"

  useEffect(() => {
    if (user) {
      inicializarDesdeFirebase(user.uid)
    }
  }, [user])

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return (
    <View style={[styles.contenedor, modoOscuro && styles.oscuro]}>
      <FlatList
        data={comidas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.fecha, modoOscuro && styles.textoOscuro]}>
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <BarraProgreso
              porcentaje={porcentaje}
              total={total}
              objetivo={objetivo}
              color={colorEstado}
            />

            <EstadoDia estado={estado} />

            {comidas.length > 0 && (
              <Text
                style={[styles.subtitulo, modoOscuro && styles.textoOscuro]}
              >
                Comidas de hoy
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => borrarComida(user!.uid, item.id)}
          >
            <TarjetaComida comida={item} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={[styles.textoVacio, modoOscuro && styles.textoOscuro]}>
              No hay comidas registradas hoy
            </Text>
            <Text
              style={[styles.textoVacioSub, modoOscuro && styles.textoOscuro]}
            >
              Ve a "Añadir" para registrar tu primera comida
            </Text>
          </View>
        }
      />
    </View>
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
  lista: {
    padding: 16,
    gap: 12,
  },
  header: {
    gap: 16,
    marginBottom: 8,
  },
  fecha: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "capitalize",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 8,
  },
  textoOscuro: {
    color: "#f1f5f9",
  },
  vacio: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 8,
  },
  textoVacio: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
    textAlign: "center",
  },
  textoVacioSub: {
    fontSize: 14,
    color: "#cbd5e1",
    textAlign: "center",
  },
})
