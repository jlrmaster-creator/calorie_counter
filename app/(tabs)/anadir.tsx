import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useStore } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { obtenerFechaActual } from "../../src/utils/calculos"
import SelectorComida from "../../src/components/SelectorComida"
import type { TipoComida } from "../../src/types"

export default function AnadirScreen() {
  const [tipo, setTipo] = useState<TipoComida>("desayuno")
  const [calorias, setCalorias] = useState("")
  const [guardando, setGuardando] = useState(false)
  const anadirComida = useStore((s) => s.anadirComida)

  async function handleGuardar() {
    const kcal = parseInt(calorias, 10)
    if (!kcal || kcal <= 0) {
      Alert.alert("Error", "Introduce un número de calorías válido")
      return
    }

    setGuardando(true)
    try {
      const user = auth.currentUser!
      await anadirComida(user.uid, tipo, kcal, obtenerFechaActual())
      setCalorias("")
      Alert.alert("✅", "Comida registrada")
    } catch {
      Alert.alert("Error", "No se pudo guardar la comida")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.contenido}>
        <Text style={styles.titulo}>
          ¿Qué has comido?
        </Text>

        <SelectorComida seleccionado={tipo} onSeleccionar={setTipo} />

        <TextInput
          style={styles.input}
          placeholder="Calorías"
          placeholderTextColor="#94a3b8"
          value={calorias}
          onChangeText={setCalorias}
          keyboardType="number-pad"
          returnKeyType="done"
        />

        <Pressable
          style={[styles.boton, guardando && styles.botonDesactivado]}
          onPress={handleGuardar}
          disabled={guardando}
        >
          <Text style={styles.textoBoton}>
            {guardando ? "Guardando..." : "Guardar comida"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contenido: {
    padding: 24,
    gap: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  boton: {
    height: 54,
    backgroundColor: "#3b82f6",
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
})
