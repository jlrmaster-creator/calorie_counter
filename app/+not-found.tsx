import { Stack } from "expo-router"
import { StyleSheet, View, Text, Pressable } from "react-native"

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Esta pantalla no existe.</Text>
        <Pressable
          style={styles.link}
          onPress={() => {
            window.location.href = "/calorie_counter/"
          }}
        >
          <Text style={styles.linkText}>Ir al inicio</Text>
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0fdf4",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#22c55e",
    borderRadius: 12,
  },
  linkText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },
})
