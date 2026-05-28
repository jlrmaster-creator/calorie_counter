import { useEffect, useState } from "react"
import { ActivityIndicator, View, StyleSheet } from "react-native"
import { Redirect } from "expo-router"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../src/config/firebase"

export default function Entry() {
  const [estado, setEstado] = useState<"cargando" | "auth" | "app">("cargando")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setEstado(user ? "app" : "auth")
    })
    return unsubscribe
  }, [])

  if (estado === "cargando") {
    return (
      <View style={styles.contenedor}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  if (estado === "auth") return <Redirect href="/(auth)" />
  return <Redirect href="/(tabs)/inicio" />
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
