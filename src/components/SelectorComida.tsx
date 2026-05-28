import { View, Text, Pressable, StyleSheet } from "react-native"
import { TIPOS_COMIDA } from "../utils/constantes"
import type { TipoComida } from "../types"

interface Props {
  seleccionado: TipoComida
  onSeleccionar: (tipo: TipoComida) => void
}

export default function SelectorComida({
  seleccionado,
  onSeleccionar,
}: Props) {
  return (
    <View style={styles.contenedor}>
      {TIPOS_COMIDA.map((tipo) => {
        const activo = seleccionado === tipo.id
        return (
          <Pressable
            key={tipo.id}
            style={[styles.boton, activo && styles.botonActivo]}
            onPress={() => onSeleccionar(tipo.id)}
          >
            <Text style={styles.icono}>{tipo.icono}</Text>
            <Text style={[styles.texto, activo && styles.textoActivo]}>
              {tipo.nombre}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  boton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    minWidth: 60,
  },
  botonActivo: {
    backgroundColor: "#3b82f6",
  },
  icono: {
    fontSize: 22,
  },
  texto: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
    color: "#4b5563",
  },
  textoActivo: {
    color: "#fff",
  },
})
