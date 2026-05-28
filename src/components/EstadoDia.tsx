import { View, Text, StyleSheet } from "react-native"
import { ESTADO_DIA_CONFIG } from "../utils/constantes"
import type { EstadoDia } from "../types"

interface Props {
  estado: EstadoDia
}

export default function EstadoDia({ estado }: Props) {
  const config = ESTADO_DIA_CONFIG[estado]

  return (
    <View style={[styles.contenedor, { backgroundColor: config.color + "20" }]}>
      <Text style={styles.icono}>{config.icono}</Text>
      <Text style={[styles.texto, { color: config.color }]}>
        {config.mensaje}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  icono: {
    fontSize: 24,
  },
  texto: {
    fontSize: 16,
    fontWeight: "700",
  },
})
