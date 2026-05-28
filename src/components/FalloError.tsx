import { View, Text, StyleSheet, Pressable } from "react-native"

interface Props {
  error?: Error
  reiniciar?: () => void
}

export default function FalloError({ error, reiniciar }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.icono}>⚠️</Text>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{error?.message || "Error inesperado"}</Text>
      {reiniciar && (
        <Pressable style={styles.boton} onPress={reiniciar}>
          <Text style={styles.textoBoton}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f8fafc" },
  icono: { fontSize: 48, marginBottom: 16 },
  titulo: { fontSize: 20, fontWeight: "700", color: "#1e293b", marginBottom: 8 },
  mensaje: { fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 24 },
  boton: { backgroundColor: "#3b82f6", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  textoBoton: { color: "#fff", fontSize: 16, fontWeight: "700" },
})
