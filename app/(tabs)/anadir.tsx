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
  FlatList,
} from "react-native"
import { useStore } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { obtenerFechaActual } from "../../src/utils/calculos"
import SelectorComida from "../../src/components/SelectorComida"
import ModalEditarComida from "../../src/components/ModalEditarComida"
import ModalBuscarAlimentos from "../../src/components/ModalBuscarAlimentos"
import type { TipoComida, Comida } from "../../src/types"
import type { Alimento } from "../../src/data/alimentos"

interface AlimentoSeleccionado {
  nombre: string
  calorias: number
}

export default function AnadirScreen() {
  const [tipo, setTipo] = useState<TipoComida>("desayuno")
  const [calorias, setCalorias] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [comidaEditar, setComidaEditar] = useState<Comida | null>(null)
  const [modalEditarVisible, setModalEditarVisible] = useState(false)
  const [modalBuscarVisible, setModalBuscarVisible] = useState(false)
  const [alimentosSel, setAlimentosSel] = useState<AlimentoSeleccionado[]>([])
  const anadirComida = useStore((s) => s.anadirComida)
  const comidas = useStore((s) => s.comidas)

  function handleSeleccionarAlimento(alimento: Alimento) {
    const nuevos = [...alimentosSel, { nombre: alimento.nombre, calorias: alimento.calorias }]
    setAlimentosSel(nuevos)
    const total = nuevos.reduce((s, a) => s + a.calorias, 0)
    setCalorias(total.toString())
    setModalBuscarVisible(false)
  }

  function eliminarAlimento(index: number) {
    const nuevos = alimentosSel.filter((_, i) => i !== index)
    setAlimentosSel(nuevos)
    const total = nuevos.reduce((s, a) => s + a.calorias, 0)
    setCalorias(total.toString())
  }

  async function handleGuardar() {
    const kcal = parseInt(calorias, 10)
    if (!kcal || kcal <= 0) {
      Alert.alert("Error", "Introduce un número de calorías válido")
      return
    }

    const fecha = obtenerFechaActual()
    const existente = comidas.find((c) => c.tipo === tipo && c.fecha === fecha)
    if (existente) {
      Alert.alert(
        "Ya existe",
        `Ya tienes un ${tipo} registrado hoy. ¿Quieres editarlo?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Editar",
            onPress: () => {
              setComidaEditar(existente)
              setModalEditarVisible(true)
            },
          },
        ]
      )
      return
    }

    setGuardando(true)
    try {
      const user = auth.currentUser!
      await anadirComida(user.uid, tipo, kcal, fecha)
      setCalorias("")
      setAlimentosSel([])
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
          style={styles.botonBuscar}
          onPress={() => setModalBuscarVisible(true)}
        >
          <Text style={styles.textoBotonBuscar}>
            Buscar alimentos
          </Text>
        </Pressable>

        {alimentosSel.length > 0 && (
          <View style={styles.listaAlimentos}>
            <Text style={styles.listaTitulo}>Alimentos seleccionados:</Text>
            {alimentosSel.map((a, i) => (
              <View key={i} style={styles.alimentoItem}>
                <Text style={styles.alimentoNombre}>{a.nombre}</Text>
                <Text style={styles.alimentoCalorias}>{a.calorias} kcal</Text>
                <Pressable onPress={() => eliminarAlimento(i)}>
                  <Text style={styles.eliminar}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={[styles.boton, guardando && styles.botonDesactivado]}
          onPress={handleGuardar}
          disabled={guardando}
        >
          <Text style={styles.textoBoton}>
            {guardando ? "Guardando..." : "Guardar comida"}
          </Text>
        </Pressable>

        <ModalEditarComida
          visible={modalEditarVisible}
          comida={comidaEditar}
          userId={auth.currentUser?.uid || ""}
          onClose={() => {
            setModalEditarVisible(false)
            setComidaEditar(null)
          }}
          onSaved={() => {}}
        />

        <ModalBuscarAlimentos
          visible={modalBuscarVisible}
          onClose={() => setModalBuscarVisible(false)}
          onSeleccionar={handleSeleccionarAlimento}
        />
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
    gap: 16,
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
  botonBuscar: {
    height: 44,
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textoBotonBuscar: {
    color: "#3b82f6",
    fontSize: 15,
    fontWeight: "700",
  },
  listaAlimentos: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  listaTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  alimentoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alimentoNombre: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
  },
  alimentoCalorias: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6",
  },
  eliminar: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "700",
    paddingLeft: 8,
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
