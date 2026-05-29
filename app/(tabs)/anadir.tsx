import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useStore } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { obtenerFechaActual, formatearFecha, obtenerNombreDia } from "../../src/utils/calculos"
import SelectorComida from "../../src/components/SelectorComida"
import ModalEditarComida from "../../src/components/ModalEditarComida"
import ModalBuscarAlimentos from "../../src/components/ModalBuscarAlimentos"
import type { TipoComida, Comida } from "../../src/types"
import type { Alimento } from "../../src/data/alimentos"
import { getSalud } from "../../src/data/alimentos"
import { PREMIOS_DEF } from "../../src/data/premios"

function sumarDiasFecha(fecha: string, dias: number): string {
  const d = new Date(fecha + "T12:00:00")
  d.setDate(d.getDate() + dias)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

interface AlimentoSel {
  nombre: string
  categoria: string
  caloriasBase: number
  gramos: number
}

export default function AnadirScreen() {
  const [tipo, setTipo] = useState<TipoComida>("desayuno")
  const [calorias, setCalorias] = useState("")
  const [nota, setNota] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [comidaEditar, setComidaEditar] = useState<Comida | null>(null)
  const [modalEditarVisible, setModalEditarVisible] = useState(false)
  const [modalBuscarVisible, setModalBuscarVisible] = useState(false)
  const [alimentosSel, setAlimentosSel] = useState<AlimentoSel[]>([])
  const [fecha, setFecha] = useState(obtenerFechaActual())
  const usuario = useStore((s) => s.usuario)
  const cargarComidas = useStore((s) => s.cargarComidas)
  const anadirComida = useStore((s) => s.anadirComida)
  const comidas = useStore((s) => s.comidas)
  const nuevosPremios = useStore((s) => s.nuevosPremios)
  const limpiarNuevosPremios = useStore((s) => s.limpiarNuevosPremios)

  useEffect(() => {
    const user = auth.currentUser
    if (user) cargarComidas(user.uid, fecha)
  }, [fecha])

  useEffect(() => {
    if (nuevosPremios.length === 0) return
    const texto = nuevosPremios
      .map((np) => {
        const def = PREMIOS_DEF.find((d) => d.id === np.id)
        return def ? `${def.icono} ${def.nombre} (+${def.estrellas}⭐)` : np.id
      })
      .join("\n")
    Alert.alert("🏆 Nuevo logro", texto)
    limpiarNuevosPremios()
  }, [nuevosPremios])

  function recalcularTotal(items: AlimentoSel[]) {
    const total = items.reduce(
      (s, a) => s + Math.round((a.caloriasBase / 100) * a.gramos),
      0
    )
    setCalorias(total.toString())
  }

  function handleSeleccionarAlimento(alimento: Alimento) {
    const nuevos = [
      ...alimentosSel,
      { nombre: alimento.nombre, categoria: alimento.categoria, caloriasBase: alimento.calorias, gramos: 100 },
    ]
    setAlimentosSel(nuevos)
    recalcularTotal(nuevos)
    setModalBuscarVisible(false)
  }

  function cambiarGramos(index: number, gramos: number) {
    const nuevos = [...alimentosSel]
    nuevos[index] = { ...nuevos[index], gramos }
    setAlimentosSel(nuevos)
    recalcularTotal(nuevos)
  }

  function eliminarAlimento(index: number) {
    const nuevos = alimentosSel.filter((_, i) => i !== index)
    setAlimentosSel(nuevos)
    recalcularTotal(nuevos)
  }

  async function handleGuardar() {
    try {
      const kcal = parseInt(calorias, 10)
      if (!kcal || kcal <= 0) {
        Alert.alert("Error", "Introduce un número de calorías válido")
        return
      }

      if (!Array.isArray(comidas)) {
        Alert.alert("Error", "Datos no disponibles, vuelve a intentarlo")
        return
      }

      const existente = comidas.find((c) => c.tipo === tipo && c.fecha === fecha)
      if (existente) {
        Alert.alert(
          "Ya existe",
          `Ya tienes un ${tipo} registrado el ${formatearFecha(fecha)}. ¿Quieres editarlo?`,
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
      const user = auth.currentUser!
      const alimentosParaGuardar = alimentosSel.map((a) => ({
        nombre: a.nombre,
        categoria: a.categoria,
        calorias: Math.round((a.caloriasBase / 100) * a.gramos),
        gramos: a.gramos,
      }))
      await anadirComida(user.uid, tipo, kcal, fecha, nota || undefined, alimentosParaGuardar)
      setCalorias("")
      setNota("")
      setAlimentosSel([])
      Alert.alert("✅", "Comida registrada")
    } catch (e) {
      console.error("Error al guardar:", e)
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
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>¿Qué has comido?</Text>

        <View style={styles.dateSelector}>
          <Pressable onPress={() => setFecha(sumarDiasFecha(fecha, -1))}>
            <Text style={styles.dateArrow}>‹</Text>
          </Pressable>
          <Text style={styles.dateText}>
            {obtenerNombreDia(fecha)} {formatearFecha(fecha)}
          </Text>
          <Pressable onPress={() => setFecha(sumarDiasFecha(fecha, 1))}>
            <Text style={styles.dateArrow}>›</Text>
          </Pressable>
          <Pressable
            onPress={() => setFecha(obtenerFechaActual())}
            style={styles.hoyBtn}
          >
            <Text style={styles.hoyText}>Hoy</Text>
          </Pressable>
        </View>

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
          <Text style={styles.textoBotonBuscar}>Buscar alimentos</Text>
        </Pressable>

        {alimentosSel.length > 0 && (
          <View style={styles.listaAlimentos}>
            <Text style={styles.listaTitulo}>Alimentos seleccionados:</Text>
            {alimentosSel.map((a, i) => {
              const calReales = Math.round((a.caloriasBase / 100) * a.gramos)
              const salud = getSalud({ nombre: a.nombre, categoria: a.categoria, calorias: a.caloriasBase })
              return (
                <View key={i} style={styles.alimentoItem}>
                  <View
                    style={[
                      styles.saludDot,
                      {
                        backgroundColor:
                          salud === "verde"
                            ? "#22c55e"
                            : salud === "amarillo"
                              ? "#eab308"
                              : "#ef4444",
                      },
                    ]}
                  />
                  <View style={styles.alimentoInfo}>
                    <Text style={styles.alimentoNombre}>{a.nombre}</Text>
                    <Text style={styles.alimentoCalorias}>
                      {calReales} kcal
                    </Text>
                  </View>
                  <View style={styles.gramosControl}>
                    <Pressable
                      onPress={() => cambiarGramos(i, Math.max(10, a.gramos - 10))}
                    >
                      <Text style={styles.gramosBtn}>−</Text>
                    </Pressable>
                    <TextInput
                      style={styles.gramosInput}
                      value={String(a.gramos)}
                      onChangeText={(v) => {
                        const g = parseInt(v, 10) || 0
                        cambiarGramos(i, g)
                      }}
                      keyboardType="number-pad"
                    />
                    <Pressable
                      onPress={() => cambiarGramos(i, Math.min(1000, a.gramos + 10))}
                    >
                      <Text style={styles.gramosBtn}>+</Text>
                    </Pressable>
                    <Text style={styles.gramosLabel}>g</Text>
                  </View>
                  <Pressable onPress={() => eliminarAlimento(i)}>
                    <Text style={styles.eliminar}>✕</Text>
                  </Pressable>
                </View>
              )
            })}
          </View>
        )}

        <TextInput
          style={styles.inputNota}
          placeholder="Nota (opcional)"
          placeholderTextColor="#94a3b8"
          value={nota}
          onChangeText={setNota}
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
          colesterol={usuario?.colesterol}
        />
      </ScrollView>
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
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateArrow: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3b82f6",
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    minWidth: 120,
    textAlign: "center",
  },
  hoyBtn: {
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  hoyText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3b82f6",
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
    gap: 10,
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
  saludDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  alimentoInfo: {
    flex: 1,
  },
  alimentoNombre: {
    fontSize: 14,
    color: "#1e293b",
  },
  alimentoCalorias: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3b82f6",
  },
  gramosControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gramosBtn: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b82f6",
    paddingHorizontal: 6,
  },
  gramosInput: {
    width: 40,
    height: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    backgroundColor: "#fff",
    padding: 0,
  },
  gramosLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  eliminar: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "700",
    paddingLeft: 4,
  },
  inputNota: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1e293b",
    backgroundColor: "#fff",
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
