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
} from "react-native"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "../../src/config/firebase"
import { crearUsuario, obtenerUsuario } from "../../src/db/usuarios"

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
        await crearUsuario(cred.user.uid, email)
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        const existe = await obtenerUsuario(cred.user.uid)
        if (!existe) {
          await crearUsuario(cred.user.uid, email)
        }
      }
    } catch (error: any) {
      const mensaje =
        error.code === "auth/user-not-found"
          ? "Usuario no encontrado"
          : error.code === "auth/wrong-password"
          ? "Contraseña incorrecta"
          : error.code === "auth/email-already-in-use"
          ? "El email ya está registrado"
          : error.code === "auth/invalid-credential"
          ? "Email o contraseña incorrectos"
          : "Error al conectar. Intenta de nuevo."
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
      <View style={styles.contenido}>
        <Text style={styles.titulo}>ContadorCalorías</Text>
        <Text style={styles.subtitulo}>Controla tu ingesta diaria</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.boton, cargando && styles.botonDesactivado]}
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

        <Pressable onPress={() => setEsRegistro(!esRegistro)}>
          <Text style={styles.enlace}>
            {esRegistro
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
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
    justifyContent: "center",
  },
  contenido: {
    paddingHorizontal: 32,
    gap: 16,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#fff",
  },
  boton: {
    height: 50,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  botonDesactivado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  enlace: {
    color: "#3b82f6",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
})
