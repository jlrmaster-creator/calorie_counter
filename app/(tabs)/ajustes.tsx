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
  const modoOscuro = useStore((s) => s.modoOscuro)
  const toggleModoOscuro = useStore((s) => s.toggleModoOscuro)

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
      style={[styles.contenedor, modoOscuro && styles.oscuro]}
      contentContainerStyle={styles.contenido}
    >
      <Text style={[styles.titulo, modoOscuro && styles.textoOscuro]}>
        Objetivo diario
      </Text>
      <TextInput
        style={[styles.input, modoOscuro && styles.inputOscuro]}
        value={objetivoInput}
        onChangeText={setObjetivoInput}
        keyboardType="number-pad"
        placeholderTextColor="#94a3b8"
      />
      <Pressable style={styles.boton} onPress={handleGuardarObjetivo}>
        <Text style={styles.textoBoton}>Guardar objetivo</Text>
      </Pressable>

      <Text style={[styles.titulo, modoOscuro && styles.textoOscuro, { marginTop: 24 }]}>
        Tipo de dieta
      </Text>
      <Text style={[styles.descripcion, modoOscuro && styles.textoOscuroSecundario]}>
        Selecciona una dieta para ajustar el objetivo automáticamente
      </Text>
      <Pressable
        style={[
          styles.opcionDieta,
          !usuario?.tipoDieta && styles.opcionDietaActiva,
          modoOscuro && styles.opcionDietaOscura,
        ]}
        onPress={() => handleCambiarDieta(null)}
      >
        <Text
          style={[
            styles.textoOpcionDieta,
            !usuario?.tipoDieta && styles.textoOpcionActiva,
            modoOscuro && styles.textoOscuro,
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
              modoOscuro && styles.opcionDietaOscura,
            ]}
            onPress={() => handleCambiarDieta(dieta.id)}
          >
            <View>
              <Text
                style={[
                  styles.textoOpcionDieta,
                  activa && styles.textoOpcionActiva,
                  modoOscuro && styles.textoOscuro,
                ]}
              >
                {dieta.nombre}
              </Text>
              <Text
                style={[
                  styles.descripcionDieta,
                  activa && styles.textoOpcionActiva,
                  modoOscuro && styles.textoOscuroSecundario,
                ]}
              >
                {dieta.descripcion} · {dieta.rangoCalorico[0]}-{dieta.rangoCalorico[1]} kcal
              </Text>
            </View>
          </Pressable>
        )
      })}

      <View style={styles.separador} />

      <Text style={[styles.titulo, modoOscuro && styles.textoOscuro]}>
        Apariencia
      </Text>
      <Pressable style={styles.filaAjuste} onPress={toggleModoOscuro}>
        <Text style={[styles.textoAjuste, modoOscuro && styles.textoOscuro]}>
          Modo oscuro
        </Text>
        <View
          style={[
            styles.toggle,
            modoOscuro && styles.toggleActivo,
          ]}
        >
          <View
            style={[
              styles.toggleCirculo,
              modoOscuro && styles.toggleCirculoActivo,
            ]}
          />
        </View>
      </Pressable>

      <View style={styles.separador} />

      <Text style={[styles.email, modoOscuro && styles.textoOscuroSecundario]}>
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
  oscuro: {
    backgroundColor: "#0f172a",
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
  textoOscuro: {
    color: "#f1f5f9",
  },
  textoOscuroSecundario: {
    color: "#94a3b8",
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
  inputOscuro: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    color: "#f1f5f9",
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
  opcionDietaOscura: {
    backgroundColor: "#1e293b",
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
  filaAjuste: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  textoAjuste: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleActivo: {
    backgroundColor: "#3b82f6",
  },
  toggleCirculo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  toggleCirculoActivo: {
    alignSelf: "flex-end",
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
