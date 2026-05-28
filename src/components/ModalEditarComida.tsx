import { useState, useEffect } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import type { Comida, TipoComida } from "../types"
import { actualizarComida } from "../db/comidas"
import SelectorComida from "./SelectorComida"

interface Props {
  visible: boolean
  comida: Comida | null
  userId: string
  onClose: () => void
  onSaved: () => void
}

export default function ModalEditarComida({
  visible,
  comida,
  userId,
  onClose,
  onSaved,
}: Props) {
  const [calorias, setCalorias] = useState("")
  const [tipo, setTipo] = useState<TipoComida>("desayuno")
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (comida) {
      setCalorias(comida.calorias.toString())
      setTipo(comida.tipo)
    }
  }, [comida])

  async function handleGuardar() {
    const kcal = parseInt(calorias, 10)
    if (!kcal || kcal <= 0) {
      Alert.alert("Error", "Introduce un número de calorías válido")
      return
    }

    setGuardando(true)
    try {
      await actualizarComida(userId, comida!.id, { calorias: kcal, tipo })
      onSaved()
      onClose()
    } catch {
      Alert.alert("Error", "No se pudo actualizar la comida")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.fondo}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modal}>
          <Text style={styles.titulo}>Editar comida</Text>

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

          <View style={styles.botones}>
            <Pressable style={styles.botonCancelar} onPress={onClose}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.botonGuardar, guardando && styles.botonDesactivado]}
              onPress={handleGuardar}
              disabled={guardando}
            >
              <Text style={styles.textoGuardar}>
                {guardando ? "Guardando..." : "Guardar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    gap: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    textAlign: "center",
  },
  botones: {
    flexDirection: "row",
    gap: 12,
  },
  botonCancelar: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  textoCancelar: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  botonGuardar: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b82f6",
  },
  botonDesactivado: {
    opacity: 0.7,
  },
  textoGuardar: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
})
