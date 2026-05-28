import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native"
import { signOut } from "firebase/auth"
import { useStore } from "../../src/store/useStore"
import { auth } from "../../src/config/firebase"
import { DIETAS } from "../../src/utils/constantes"
import type { TipoDieta } from "../../src/types"

export default function AjustesScreen() {
  const usuario = useStore((s) => s.usuario)
  const cambiarObjetivo = useStore((s) => s.cambiarObjetivo)
  const cambiarDieta = useStore((s) => s.cambiarDieta)
  const [objetivoInput, setObjetivoInput] = useState(
    String(usuario?.objetivoCalorias || 2000)
  )

  async function handleGuardarObjetivo() {
    const kcal = parseInt(objetivoInput, 10)
    if (!kcal || kcal < 500 || kcal > 10000) {
      Alert.alert("Error", "Introduce un valor entre 500 y 10000 kcal")
      return
    }
    const user = auth.currentUser
    if (!user) return
    await cambiarObjetivo(user.uid, kcal)
    Alert.alert("✅", "Objetivo actualizado")
  }

  async function handleCambiarDieta(dieta: TipoDieta | null) {
    const user = auth.currentUser
    if (!user) return
    await cambiarDieta(user.uid, dieta)

    if (dieta) {
      const info = DIETAS.find((d) => d.id === dieta)
      if (info) {
        setObjetivoInput(String(info.rangoCalorico[1]))
        await cambiarObjetivo(user.uid, info.rangoCalorico[1])
      }
    }
  }

  function handleCerrarSesion() {
    signOut(auth)
  }

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
    >
      <Text style={styles.titulo}>
        Objetivo diario
      </Text>
      <TextInput
        style={styles.input}
        value={objetivoInput}
        onChangeText={setObjetivoInput}
        keyboardType="number-pad"
        placeholderTextColor="#94a3b8"
      />
      <Pressable style={styles.boton} onPress={handleGuardarObjetivo}>
        <Text style={styles.textoBoton}>Guardar objetivo</Text>
      </Pressable>

      <Text style={[styles.titulo, { marginTop: 24 }]}>
        Tipo de dieta
      </Text>
      <Text style={styles.descripcion}>
        Selecciona una dieta para ajustar el objetivo automáticamente
      </Text>
      <Pressable
        style={[
          styles.opcionDieta,
          !usuario?.tipoDieta && styles.opcionDietaActiva,
        ]}
        onPress={() => handleCambiarDieta(null)}
      >
        <Text
          style={[
            styles.textoOpcionDieta,
            !usuario?.tipoDieta && styles.textoOpcionActiva,
          ]}
        >
          Sin dieta específica
        </Text>
      </Pressable>
      {DIETAS.map((dieta) => {
        const activa = usuario?.tipoDieta === dieta.id
        return (
          <Pressable
            key={dieta.id}
            style={[
              styles.opcionDieta,
              activa && styles.opcionDietaActiva,
            ]}
            onPress={() => handleCambiarDieta(dieta.id)}
          >
            <View>
              <Text
                style={[
                  styles.textoOpcionDieta,
                  activa && styles.textoOpcionActiva,
                ]}
              >
                {dieta.nombre}
              </Text>
              <Text
                style={[
                  styles.descripcionDieta,
                  activa && styles.textoOpcionActiva,
                ]}
              >
                {dieta.descripcion} · {dieta.rangoCalorico[0]}-{dieta.rangoCalorico[1]} kcal
              </Text>
            </View>
          </Pressable>
        )
      })}

      <View style={styles.separador} />

      <Text style={styles.email}>
        {usuario?.email}
      </Text>
      <Pressable style={styles.botonCerrarSesion} onPress={handleCerrarSesion}>
        <Text style={styles.textoCerrarSesion}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contenido: {
    padding: 24,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    backgroundColor: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  boton: {
    height: 48,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  opcionDieta: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  opcionDietaActiva: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  textoOpcionDieta: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  textoOpcionActiva: {
    color: "#3b82f6",
  },
  descripcionDieta: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  separador: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 24,
  },
  email: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 12,
  },
  botonCerrarSesion: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ef4444",
    alignItems: "center",
  },
  textoCerrarSesion: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "600",
  },
})
