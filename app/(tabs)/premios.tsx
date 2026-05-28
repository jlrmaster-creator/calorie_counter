import { useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native"
import { useStore } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { PREMIOS_DEF, obtenerRango } from "../../src/data/premios"
import TarjetaPremio from "../../src/components/TarjetaPremio"

export default function PremiosScreen() {
  const premios = useStore((s) => s.premios)
  const cargarPremios = useStore((s) => s.cargarPremios)
  const user = auth.currentUser

  useEffect(() => {
    if (user) {
      cargarPremios(user.uid)
    }
  }, [user])

  const idsDesbloqueados = new Set(premios.map((p) => p.id))
  const totalEstrellas = PREMIOS_DEF.reduce(
    (sum, d) => sum + (idsDesbloqueados.has(d.id) ? d.estrellas : 0),
    0
  )
  const rango = obtenerRango(totalEstrellas)
  const totalPosibles = PREMIOS_DEF.reduce((sum, d) => sum + d.estrellas, 0)

  return (
    <View style={styles.contenedor}>
      <View style={styles.rangoCard}>
        <Text style={styles.rangoIcono}>{rango.icono}</Text>
        <Text style={styles.rangoNombre}>{rango.nombre}</Text>
        <Text style={styles.rangoEstrellas}>
          ⭐ {totalEstrellas} / {totalPosibles} estrellas
        </Text>
        <View style={styles.barraContenedor}>
          <View
            style={[
              styles.barraLlena,
              { width: `${(totalEstrellas / totalPosibles) * 100}%` },
            ]}
          />
        </View>
      </View>

      <Text style={styles.subtitulo}>Logros</Text>

      <FlatList
        data={PREMIOS_DEF}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TarjetaPremio
            definicion={item}
            premio={premios.find((p) => p.id === item.id)}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  rangoCard: {
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  rangoIcono: {
    fontSize: 48,
  },
  rangoNombre: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
  },
  rangoEstrellas: {
    fontSize: 14,
    color: "#64748b",
  },
  barraContenedor: {
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 5,
    width: "100%",
    maxWidth: 300,
    overflow: "hidden",
  },
  barraLlena: {
    height: "100%",
    backgroundColor: "#f59e0b",
    borderRadius: 5,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  lista: {
    padding: 16,
    gap: 10,
  },
})
