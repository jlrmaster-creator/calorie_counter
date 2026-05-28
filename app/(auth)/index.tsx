import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { router } from "expo-router"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "../../src/config/firebase"
import { crearUsuario } from "../../src/db/usuarios"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [esRegistro, setEsRegistro] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos")
      return
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
      return
    }

    setCargando(true)
    try {
      if (esRegistro) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await crearUsuario(cred.user.uid, email.trim())
        router.replace("/(tabs)/inicio")
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
        router.replace("/(tabs)/inicio")
      }
    } catch (error: any) {
      const codigo = error.code
      let mensaje = "Error al conectar. Intenta de nuevo."
      if (codigo === "auth/user-not-found" || codigo === "auth/invalid-credential")
        mensaje = "Email o contraseña incorrectos"
      else if (codigo === "auth/wrong-password")
        mensaje = "Contraseña incorrecta"
      else if (codigo === "auth/email-already-in-use")
        mensaje = "El email ya está registrado"
      else if (codigo === "auth/too-many-requests")
        mensaje = "Demasiados intentos. Espera un momento."
      Alert.alert("Error", mensaje)
    } finally {
      setCargando(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contenido}>
          <Text style={styles.titulo}>ContadorCalorías</Text>
          <Text style={styles.subtitulo}>Controla tu ingesta diaria</Text>

          <View
            style={[
              styles.tarjeta,
              esRegistro ? styles.tarjetaRegistro : styles.tarjetaLogin,
            ]}
          >
            <Text
              style={[
                styles.modoLabel,
                esRegistro ? styles.textoRegistro : styles.textoLogin,
              ]}
            >
              {esRegistro ? "📝 Crear cuenta" : "🔑 Iniciar sesión"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={esRegistro ? "new-password" : "password"}
            />

            <Pressable
              style={[
                styles.boton,
                esRegistro ? styles.botonRegistro : styles.botonLogin,
                cargando && styles.botonDesactivado,
              ]}
              onPress={handleSubmit}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBoton}>
                  {esRegistro ? "Crear cuenta" : "Iniciar sesión"}
                </Text>
              )}
            </Pressable>
          </View>

          <Pressable
            style={styles.enlaceBoton}
            onPress={() => {
              setEsRegistro(!esRegistro)
              setPassword("")
            }}
          >
            <Text style={styles.enlaceTexto}>
              {esRegistro
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  contenido: {
    paddingHorizontal: 24,
    gap: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#15803d",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 8,
  },
  tarjeta: {
    borderRadius: 16,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tarjetaLogin: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  tarjetaRegistro: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  modoLabel: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  textoLogin: {
    color: "#15803d",
  },
  textoRegistro: {
    color: "#2563eb",
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
  boton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  botonLogin: {
    backgroundColor: "#22c55e",
  },
  botonRegistro: {
    backgroundColor: "#3b82f6",
  },
  botonDesactivado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  enlaceBoton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  enlaceTexto: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },
})
