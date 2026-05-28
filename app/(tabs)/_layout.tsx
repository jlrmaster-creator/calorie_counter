import { Tabs } from "expo-router"
import { Text, Platform } from "react-native"
import { useStore } from "../../src/store/useStore"
import { useEffect } from "react"

const iconos: Record<string, string> = {
  inicio: "📊",
  anadir: "➕",
  historial: "📅",
  ajustes: "⚙️",
}

export default function TabLayout() {
  const modoOscuro = useStore((s) => s.modoOscuro)
  const cargarPreferencias = useStore((s) => s.cargarPreferencias)

  useEffect(() => {
    cargarPreferencias()
  }, [])

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: modoOscuro ? "#1e293b" : "#fff",
        },
        headerTintColor: modoOscuro ? "#f1f5f9" : "#1e293b",
        tabBarStyle: {
          backgroundColor: modoOscuro ? "#1e293b" : "#fff",
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Hoy",
          tabBarIcon: () => (
            <Text style={{ fontSize: 22 }}>{iconos.inicio}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="anadir"
        options={{
          title: "Añadir",
          tabBarIcon: () => (
            <Text style={{ fontSize: 22 }}>{iconos.anadir}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: "Historial",
          tabBarIcon: () => (
            <Text style={{ fontSize: 22 }}>{iconos.historial}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: "Ajustes",
          tabBarIcon: () => (
            <Text style={{ fontSize: 22 }}>{iconos.ajustes}</Text>
          ),
        }}
      />
    </Tabs>
  )
}
