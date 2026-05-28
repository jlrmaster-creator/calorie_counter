import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useStore } from "../src/store/useStore"
import { useEffect } from "react"

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "index",
}

export default function RootLayout() {
  const modoOscuro = useStore((s) => s.modoOscuro)
  const cargarPreferencias = useStore((s) => s.cargarPreferencias)

  useEffect(() => {
    cargarPreferencias()
  }, [])

  return (
    <>
      <StatusBar style={modoOscuro ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  )
}
