import { Tabs } from "expo-router"
import { Text } from "react-native"

const iconos: Record<string, string> = {
  inicio: "📊",
  anadir: "➕",
  historial: "📅",
  ajustes: "⚙️",
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#1e293b",
        tabBarStyle: {
          backgroundColor: "#fff",
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
