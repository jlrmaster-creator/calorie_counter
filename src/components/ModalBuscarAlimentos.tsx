import { useState, useMemo, useCallback } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native"
import { buscarAlimentos, CATEGORIAS, getSalud, getColesterolAlto } from "../data/alimentos"
import type { Alimento, Salud } from "../data/alimentos"

interface Props {
  visible: boolean
  onClose: () => void
  onSeleccionar: (alimento: Alimento) => void
  colesterol?: boolean
}

const COLOR_SALUD: Record<Salud, string> = {
  verde: "#22c55e",
  amarillo: "#eab308",
  rojo: "#ef4444",
}

export default function ModalBuscarAlimentos({
  visible,
  onClose,
  onSeleccionar,
  colesterol = false,
}: Props) {
  const [query, setQuery] = useState("")

  const resultados = useMemo(() => {
    if (!query.trim()) return []
    return buscarAlimentos(query.trim())
  }, [query])

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.fondo}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Buscar alimento</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.cerrar}>Cerrar</Text>
            </Pressable>
          </View>

          <Text style={styles.sugerenciasSub}>
            Escribe un alimento para buscarlo
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ej: pollo, arroz, manzana..."
            placeholderTextColor="#94a3b8"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />

          {query.trim() === "" ? (
            <View style={styles.sugerencias}>
              <Text style={styles.sugerenciasTitulo}>Categorías</Text>
              {CATEGORIAS.map((cat) => (
                <Text key={cat} style={styles.categoriaItem}>
                  {cat}
                </Text>
              ))}
            </View>
          ) : resultados.length === 0 ? (
            <View style={styles.vacio}>
              <Text style={styles.textoVacio}>
                No se encontraron alimentos
              </Text>
            </View>
          ) : (
            <FlatList
              data={resultados}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={styles.lista}
              renderItem={({ item }) => {
                const salud = getSalud(item)
                const perjudicial = colesterol && getColesterolAlto(item)
                return (
                  <Pressable
                    style={styles.alimentoItem}
                    onPress={() => {
                      if (perjudicial) {
                        Alert.alert(
                          "⚠️ Alimento perjudicial",
                          `${item.nombre} puede ser perjudicial para el colesterol alto. ¿Añadirlo de todas formas?`,
                          [
                            { text: "Cancelar", style: "cancel" },
                            {
                              text: "Añadir",
                              onPress: () => {
                                onSeleccionar(item)
                                setQuery("")
                              },
                            },
                          ]
                        )
                      } else {
                        onSeleccionar(item)
                        setQuery("")
                      }
                    }}
                  >
                    <View style={styles.indicadorContainer}>
                      <View
                        style={[
                          styles.indicador,
                          { backgroundColor: COLOR_SALUD[salud] },
                        ]}
                      />
                      {perjudicial && (
                        <Text style={styles.indicadorAdvertencia}>!</Text>
                      )}
                    </View>
                    <View style={styles.alimentoInfo}>
                      <Text style={styles.alimentoNombre}>{item.nombre}</Text>
                      <Text style={styles.alimentoCategoria}>
                        {item.categoria}
                      </Text>
                    </View>
                    <Text style={styles.alimentoCalorias}>
                      {item.calorias} kcal
                    </Text>
                  </Pressable>
                )
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
  },
  cerrar: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  sugerencias: {
    gap: 6,
  },
  sugerenciasTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 4,
  },
  sugerenciasSub: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 16,
  },
  categoriaItem: {
    fontSize: 14,
    color: "#475569",
    paddingVertical: 4,
  },
  lista: {
    gap: 4,
  },
  vacio: {
    paddingVertical: 32,
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 15,
    color: "#94a3b8",
  },
  alimentoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  alimentoInfo: {
    flex: 1,
  },
  alimentoNombre: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  alimentoCategoria: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 1,
  },
  alimentoCalorias: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3b82f6",
  },
  indicadorContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  indicador: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  indicadorAdvertencia: {
    position: "absolute",
    top: -4,
    right: -4,
    fontSize: 10,
    fontWeight: "900",
    color: "#ef4444",
    backgroundColor: "#fff",
    borderRadius: 8,
    width: 14,
    height: 14,
    textAlign: "center",
    lineHeight: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
})
