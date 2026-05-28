import { View, Text, Pressable, StyleSheet } from "react-native"
import { TIPOS_COMIDA } from "../utils/constantes"
import type { Comida } from "../types"

interface Props {
  comida: Comida
  onEditar: () => void
  onEliminar: () => void
}

export default function TarjetaComida({ comida, onEditar, onEliminar }: Props) {
  const info = TIPOS_COMIDA.find((t) => t.id === comida.tipo)

  return (
    <View style={styles.contenedor}>
      <Text style={styles.icono}>{info?.icono || "🍽️"}</Text>
      <View style={styles.info}>
        <Text style={styles.tipo}>{info?.nombre || comida.tipo}</Text>
        <Text style={styles.hora}>
          {new Date(comida.creadoEn).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text style={styles.calorias}>{comida.calorias} kcal</Text>
      <Pressable style={styles.botonAccion} onPress={onEditar}>
        <Text style={styles.iconoAccion}>✏️</Text>
      </Pressable>
      <Pressable style={styles.botonAccion} onPress={onEliminar}>
        <Text style={styles.iconoAccion}>🗑️</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icono: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  tipo: {
    fontSize: 16,
    fontWeight: "600",
  },
  hora: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  calorias: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3b82f6",
    marginRight: 4,
  },
  botonAccion: {
    padding: 6,
  },
  iconoAccion: {
    fontSize: 18,
  },
})
