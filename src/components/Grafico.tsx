import { View, Text, StyleSheet, Dimensions } from "react-native"
import { BarChart } from "react-native-chart-kit"

interface DatosGrafico {
  labels: string[]
  data: number[]
}

interface Props {
  datos: DatosGrafico
  color?: string
}

export default function Grafico({ datos, color = "#3b82f6" }: Props) {
  if (datos.data.every((v) => v === 0)) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.textoVacio}>Sin datos esta semana</Text>
      </View>
    )
  }

  return (
    <BarChart
      data={{
        labels: datos.labels,
        datasets: [{ data: datos.data.length > 0 ? datos.data : [0] }],
      }}
      width={Dimensions.get("window").width - 64}
      height={200}
      yAxisLabel=""
      yAxisSuffix=""
      chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: () => color,
        labelColor: () => "#6b7280",
        barPercentage: 0.6,
        propsForBackgroundLines: {
          strokeDasharray: "",
          stroke: "#f3f4f6",
        },
      }}
      fromZero
      showValuesOnTopOfBars
      style={styles.grafico}
    />
  )
}

const styles = StyleSheet.create({
  grafico: {
    borderRadius: 12,
  },
  vacio: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  textoVacio: {
    color: "#9ca3af",
    fontSize: 14,
  },
})
