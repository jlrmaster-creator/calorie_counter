import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native"
import { useStore, calcularTotalCalorias } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { obtenerFechaActual } from "../../src/utils/calculos"
import { calcularEstadoDia } from "../../src/utils/calculos"
import { pedirPermisoNotificaciones } from "../../src/utils/notificaciones"
import BarraProgreso from "../../src/components/BarraProgreso"
import EstadoDia from "../../src/components/EstadoDia"
import TarjetaComida from "../../src/components/TarjetaComida"
import type { EstadoDia as EstadoDiaTipo } from "../../src/types"

import ModalEditarComida from "../../src/components/ModalEditarComida"
import type { Comida } from "../../src/types"

export default function InicioScreen() {
  const usuario = useStore((s) => s.usuario)
  const comidas = useStore((s) => s.comidas)
  const cargando = useStore((s) => s.cargando)
  const cargarComidas = useStore((s) => s.cargarComidas)
  const inicializarDesdeFirebase = useStore((s) => s.inicializarDesdeFirebase)
  const borrarComida = useStore((s) => s.borrarComida)
  const [refrescando, setRefrescando] = useState(false)
  const [comidaEditar, setComidaEditar] = useState<Comida | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

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

  useEffect(() => {
    pedirPermisoNotificaciones()
  }, [])

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
              total={total}
              objetivo={objetivo}
              color={colorEstado}
            />

            <EstadoDia estado={estado} />

            {comidas.length > 0 && (
              <Text
                style={styles.subtitulo}
              >
                Comidas de hoy
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              Alert.alert("Opciones", "¿Qué quieres hacer?", [
                {
                  text: "Editar",
                  onPress: () => {
                    setComidaEditar(item)
                    setModalVisible(true)
                  },
                },
                {
                  text: "Eliminar",
                  onPress: () => {
                    Alert.alert(
                      "Confirmar",
                      "¿Seguro que quieres eliminar esta comida?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Eliminar", style: "destructive", onPress: () => borrarComida(user!.uid, item.id) },
                      ]
                    )
                  },
                },
                { text: "Cancelar", style: "cancel" },
              ])
            }}
          >
            <TarjetaComida comida={item} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.textoVacio}>
              No hay comidas registradas hoy
            </Text>
            <Text
              style={styles.textoVacioSub}
            >
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
