import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native"
import { useStore, calcularTotalCalorias, calcularTotalEjercicios, calcularNetoCalorias } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { obtenerFechaActual } from "../../src/utils/calculos"
import { calcularEstadoDia, obtenerNombreDia } from "../../src/utils/calculos"
import { pedirPermisoNotificaciones } from "../../src/utils/notificaciones"
import { obtenerComidasPorRango } from "../../src/db/comidas"
import BarraProgreso from "../../src/components/BarraProgreso"
import EstadoDia from "../../src/components/EstadoDia"
import TarjetaComida from "../../src/components/TarjetaComida"
import ModalEditarComida from "../../src/components/ModalEditarComida"
import type { EstadoDia as EstadoDiaTipo, Comida } from "../../src/types"

function sumarDias(fecha: string, dias: number): string {
  const d = new Date(fecha)
  d.setDate(d.getDate() + dias)
  return d.toISOString().split("T")[0]
}

export default function InicioScreen() {
  const usuario = useStore((s) => s.usuario)
  const comidas = useStore((s) => s.comidas)
  const cargando = useStore((s) => s.cargando)
  const cargarComidas = useStore((s) => s.cargarComidas)
  const inicializarDesdeFirebase = useStore((s) => s.inicializarDesdeFirebase)
  const borrarComida = useStore((s) => s.borrarComida)
  const ejercicios = useStore((s) => s.ejercicios)
  const [refrescando, setRefrescando] = useState(false)
  const [comidaEditar, setComidaEditar] = useState<Comida | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [historial7, setHistorial7] = useState<
    { fecha: string; total: number; dentro: boolean }[]
  >([])

  const user = auth.currentUser
  const fechaActiva = obtenerFechaActual()
  const total = calcularTotalCalorias(comidas)
  const totalEjercicio = calcularTotalEjercicios(ejercicios)
  const neto = calcularNetoCalorias(comidas, ejercicios)
  const objetivo = usuario?.objetivoCalorias || 2000
  const estado = calcularEstadoDia(neto, objetivo) as EstadoDiaTipo
  const porcentaje = objetivo > 0 ? (neto / objetivo) * 100 : 0

  const colorEstado =
    estado === "dentro_objetivo"
      ? "#22c55e"
      : estado === "cercano_limite"
      ? "#eab308"
      : "#ef4444"

  const rachaActual = () => {
    let r = 0
    for (const d of historial7) {
      if (d.dentro) r++
      else break
    }
    return r
  }

  const cargarHistorial7 = useCallback(async () => {
    if (!user) return
    const inicio = sumarDias(fechaActiva, -6)
    const todas = await obtenerComidasPorRango(user.uid, inicio, fechaActiva)
    const porFecha: Record<string, Comida[]> = {}
    for (const c of todas) {
      if (!porFecha[c.fecha]) porFecha[c.fecha] = []
      porFecha[c.fecha].push(c)
    }
    const dias: { fecha: string; total: number; dentro: boolean }[] = []
    for (let i = 6; i >= 0; i--) {
      const f = sumarDias(fechaActiva, -i)
      const c = porFecha[f] || []
      const kcal = c.reduce((s, x) => s + x.calorias, 0)
      dias.push({
        fecha: f,
        total: kcal,
        dentro: kcal > 0 && kcal <= objetivo,
      })
    }
    setHistorial7(dias)
  }, [user, fechaActiva, objetivo])

  useEffect(() => {
    if (user) {
      inicializarDesdeFirebase(user.uid)
    }
  }, [user])

  useEffect(() => {
    pedirPermisoNotificaciones()
  }, [])

  useEffect(() => {
    if (user && comidas.length >= 0) {
      cargarHistorial7()
    }
  }, [user, comidas])

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={comidas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={async () => {
              setRefrescando(true)
              await cargarComidas(user?.uid || "")
              setRefrescando(false)
            }}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.fecha}>
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <BarraProgreso
              porcentaje={porcentaje}
              total={neto}
              objetivo={objetivo}
              color={colorEstado}
            />

            {totalEjercicio > 0 && (
              <View style={styles.ejercicioBadge}>
                <Text style={styles.ejercicioBadgeTexto}>
                  💪 {totalEjercicio} kcal quemadas en ejercicio
                </Text>
              </View>
            )}

            <EstadoDia estado={estado} />

            <View style={styles.rachaCard}>
              <Text style={styles.rachaIcono}>
                {rachaActual() >= 7 ? "🔥" : rachaActual() >= 3 ? "⭐" : "📅"}
              </Text>
              <View style={styles.rachaInfo}>
                <Text style={styles.rachaNum}>{rachaActual()}</Text>
                <Text style={styles.rachaLabel}>días seguidos cumpliendo objetivo</Text>
              </View>
            </View>

            <View style={styles.semana}>
              {historial7.map((d, i) => {
                const hoy = d.fecha === fechaActiva
                return (
                  <View key={i} style={styles.diaCol}>
                    <Text style={[styles.diaNombre, hoy && styles.diaHoy]}>
                      {obtenerNombreDia(d.fecha)}
                    </Text>
                    <Text style={styles.diaIcono}>
                      {d.dentro ? "✅" : d.total > 0 ? "⚠️" : "⬜"}
                    </Text>
                  </View>
                )
              })}
            </View>

            {comidas.length > 0 && (
              <Text style={styles.subtitulo}>Comidas de hoy</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TarjetaComida
            comida={item}
            onEditar={() => {
              setComidaEditar(item)
              setModalVisible(true)
            }}
            onEliminar={() => borrarComida(user!.uid, item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.textoVacio}>
              No hay comidas registradas hoy
            </Text>
            <Text style={styles.textoVacioSub}>
              Ve a "Añadir" para registrar tu primera comida
            </Text>
          </View>
        }
      />
      <ModalEditarComida
        visible={modalVisible}
        comida={comidaEditar}
        userId={user?.uid || ""}
        onClose={() => {
          setModalVisible(false)
          setComidaEditar(null)
        }}
        onSaved={() => cargarComidas(user?.uid || "")}
      />
    </View>
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
  ejercicioBadge: {
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  ejercicioBadgeTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16a34a",
  },
  rachaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  rachaIcono: {
    fontSize: 28,
  },
  rachaInfo: {
    flex: 1,
  },
  rachaNum: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f59e0b",
  },
  rachaLabel: {
    fontSize: 12,
    color: "#92400e",
    marginTop: 2,
  },
  semana: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  diaCol: {
    alignItems: "center",
    gap: 4,
  },
  diaNombre: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
  },
  diaHoy: {
    color: "#3b82f6",
    fontWeight: "700",
  },
  diaIcono: {
    fontSize: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 8,
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
