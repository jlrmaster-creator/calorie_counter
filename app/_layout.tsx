import { useState, useEffect } from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { View, Pressable, Text, StyleSheet, Platform } from "react-native"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../src/config/firebase"
import { useStore } from "../src/store/useStore"

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "index",
}

export default function RootLayout() {
  const [logueado, setLogueado] = useState(false)
  const modoOscuro = useStore((s) => s.modoOscuro)
  const cargarPreferencias = useStore((s) => s.cargarPreferencias)

  useEffect(() => {
    cargarPreferencias()
    const unsub = onAuthStateChanged(auth, (user) => setLogueado(!!user))
    return unsub
  }, [])

  return (
    <>
      <StatusBar style={modoOscuro ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      {logueado && (
        <Pressable
          style={styles.botonCerrarSesion}
          onPress={async () => {
            await signOut(auth)
            if (Platform.OS === "web") window.location.href = "/calorie_counter/"
          }}
        >
          <Text style={styles.textoCerrarSesion}>Cerrar sesión</Text>
        </Pressable>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  botonCerrarSesion: {
    position: "absolute",
    top: Platform.OS === "web" ? 8 : 50,
    right: 8,
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 999,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  textoCerrarSesion: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
})
