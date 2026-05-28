import { View, Text, StyleSheet } from "react-native"

interface Props {
  porcentaje: number
  total: number
  objetivo: number
  color: string
}

export default function BarraProgreso({
  porcentaje,
  total,
  objetivo,
  color,
}: Props) {
  const anchoBarra = Math.min(porcentaje, 100)

  return (
    <View style={styles.contenedor}>
      <View style={styles.barraFondo}>
        <View
          style={[
            styles.barraLlena,
            { width: `${anchoBarra}%` as any, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.texto}>
        {total} / {objetivo} kcal
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 8,
  },
  barraFondo: {
    height: 24,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  barraLlena: {
    height: "100%",
    borderRadius: 12,
  },
  texto: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
})
