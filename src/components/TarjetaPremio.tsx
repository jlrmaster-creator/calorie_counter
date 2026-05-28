import { View, Text, StyleSheet } from "react-native"
import type { PremioDef, Premio } from "../types"

interface Props {
  definicion: PremioDef
  premio?: Premio
}

export default function TarjetaPremio({ definicion, premio }: Props) {
  const desbloqueado = !!premio

  return (
    <View style={[styles.contenedor, desbloqueado && styles.desbloqueado]}>
      <Text style={styles.icono}>{definicion.icono}</Text>
      <View style={styles.info}>
        <Text style={[styles.nombre, desbloqueado && styles.nombreActivo]}>
          {definicion.nombre}
        </Text>
        <Text style={styles.descripcion}>{definicion.descripcion}</Text>
      </View>
      <View style={styles.estrellas}>
        <Text style={styles.estrellaIcono}>⭐</Text>
        <Text style={styles.estrellaNum}>x{definicion.estrellas}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    gap: 12,
    opacity: 0.5,
  },
  desbloqueado: {
    opacity: 1,
    borderWidth: 1,
    borderColor: "#fbbf24",
    backgroundColor: "#fffbeb",
  },
  icono: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94a3b8",
  },
  nombreActivo: {
    color: "#1e293b",
  },
  descripcion: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  estrellas: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  estrellaIcono: {
    fontSize: 14,
  },
  estrellaNum: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f59e0b",
  },
})
