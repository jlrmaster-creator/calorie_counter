import { jsPDF } from "jspdf"
import "jspdf-autotable"
import type { Comida, RegistroEjercicio, AlimentoEnComida } from "../types"

const COLORES_CATEGORIA: Record<string, string> = {
  Carnes: "#ef4444",
  Verduras: "#22c55e",
  Frutas: "#22c55e",
  Legumbres: "#22c55e",
  Pescados: "#22c55e",
  Huevos: "#eab308",
  Lácteos: "#eab308",
  Cereales: "#eab308",
  "Frutos secos": "#eab308",
  Aceites: "#ef4444",
  Dulces: "#ef4444",
  Pastelería: "#ef4444",
  Bebidas: "#3b82f6",
  Salsas: "#eab308",
  Especias: "#22c55e",
  Aperitivos: "#ef4444",
}

const COLORES_TIPO: Record<string, string> = {
  desayuno: "#3b82f6",
  almuerzo: "#8b5cf6",
  comida: "#f59e0b",
  merienda: "#22c55e",
  cena: "#ef4444",
  tapas: "#ec4899",
}

const NOMBRES_TIPO: Record<string, string> = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  comida: "Comida",
  merienda: "Merienda",
  cena: "Cena",
  tapas: "Tapas",
}

export function generarPDF(
  fecha: string,
  comidas: Comida[],
  ejercicios: RegistroEjercicio[],
  objetivo: number
) {
  const doc = new jsPDF()
  let y = 20

  function saltar(px: number) {
    y += px
  }

  function texto(t: string, size = 12, estilo: "normal" | "bold" = "normal", color?: string) {
    doc.setFontSize(size)
    doc.setFont("helvetica", estilo)
    if (color) doc.setTextColor(color)
    else doc.setTextColor("#1e293b")
    doc.text(t, 20, y)
    saltar(7)
  }

  function linea() {
    doc.setDrawColor("#e2e8f0")
    doc.line(20, y, 190, y)
    saltar(6)
  }

  // --- TITLE ---
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#1e293b")
  doc.text("Informe diario", 20, y)
  saltar(2)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#64748b")
  const [yr, mo, dy] = fecha.split("-")
  doc.text(`${dy}/${mo}/${yr}`, 20, y)
  saltar(10)

  linea()

  // --- MEALS ---
  texto("Comidas registradas", 14, "bold", "#1e293b")

  const comidasPorTipo: Record<string, Comida[]> = {}
  for (const c of comidas) {
    if (!comidasPorTipo[c.tipo]) comidasPorTipo[c.tipo] = []
    comidasPorTipo[c.tipo].push(c)
  }

  const ordenTipos = ["desayuno", "almuerzo", "comida", "merienda", "cena", "tapas"]

  for (const tipo of ordenTipos) {
    const lista = comidasPorTipo[tipo]
    if (!lista) continue
    const totalTipo = lista.reduce((s, c) => s + c.calorias, 0)

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(COLORES_TIPO[tipo] || "#1e293b")
    doc.text(`${NOMBRES_TIPO[tipo]} — ${totalTipo} kcal`, 20, y)
    saltar(5)

    for (const comida of lista) {
      if (comida.nota) {
        doc.setFontSize(10)
        doc.setFont("helvetica", "italic")
        doc.setTextColor("#64748b")
        doc.text(`   📝 ${comida.nota}`, 20, y)
        saltar(4)
      }

      if (comida.alimentos && comida.alimentos.length > 0) {
        for (const al of comida.alimentos) {
          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          doc.setTextColor("#475569")
          const catColor = COLORES_CATEGORIA[al.categoria] || "#94a3b8"
          doc.text(`   • ${al.nombre} (${al.gramos}g) — ${al.calorias} kcal`, 20, y)
          doc.setFillColor(catColor)
          doc.circle(17, y - 2, 1.5, "F")
          saltar(4)
        }
      } else {
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor("#94a3b8")
        doc.text(`   ${comida.calorias} kcal`, 20, y)
        saltar(4)
      }
    }
    saltar(2)
  }

  // --- TOTAL ---
  linea()
  const totalCalorias = comidas.reduce((s, c) => s + c.calorias, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#1e293b")
  doc.text(`Total: ${totalCalorias} kcal`, 20, y)
  saltar(4)

  // --- EXERCISE ---
  if (ejercicios.length > 0) {
    const totalEjer = ejercicios.reduce((s, e) => s + e.calorias, 0)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor("#16a34a")
    doc.text(`Ejercicio: ${totalEjer} kcal quemadas`, 20, y)
    saltar(4)

    for (const ej of ejercicios) {
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor("#475569")
      doc.text(`   💪 ${ej.nombre} — ${ej.minutos} min (${ej.calorias} kcal)`, 20, y)
      saltar(4)
    }

    const neto = totalCalorias - totalEjer
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(neto <= objetivo ? "#22c55e" : "#ef4444")
    doc.text(`Neto: ${neto} kcal`, 20, y)
    saltar(4)
  }

  saltar(6)

  // --- BAR CHART: Calorias por tipo de comida ---
  if (comidas.length > 0) {
    linea()
    texto("Calorías por comida", 14, "bold", "#1e293b")

    const maxBarW = 120
    const maxVal = Math.max(...ordenTipos.map((t) => {
      const l = comidasPorTipo[t]
      return l ? l.reduce((s, c) => s + c.calorias, 0) : 0
    }), 1)

    for (const tipo of ordenTipos) {
      const lista = comidasPorTipo[tipo]
      if (!lista) continue
      const totalTipo = lista.reduce((s, c) => s + c.calorias, 0)
      const barW = (totalTipo / maxVal) * maxBarW

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor("#64748b")
      doc.text(NOMBRES_TIPO[tipo].padEnd(12), 20, y)

      doc.setFillColor(COLORES_TIPO[tipo] || "#94a3b8")
      doc.rect(60, y - 3, barW, 6, "F")

      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor("#1e293b")
      doc.text(`${totalTipo} kcal`, 62 + barW, y + 1)

      saltar(9)
    }

    saltar(4)

    // --- DONUT CHART: Distribucion por categoria de alimento ---
    const alimentosAgrupados: Record<string, number> = {}
    let totalCat = 0
    for (const c of comidas) {
      if (c.alimentos) {
        for (const al of c.alimentos) {
          alimentosAgrupados[al.categoria] = (alimentosAgrupados[al.categoria] || 0) + al.calorias
          totalCat += al.calorias
        }
      }
    }

    if (totalCat > 0) {
      linea()
      texto("Distribución por tipo de alimento", 14, "bold", "#1e293b")

      const categorias = Object.entries(alimentosAgrupados).sort((a, b) => b[1] - a[1])
      const cx = 105
      const cy = y + 30
      const r = 25
      let anguloInicio = 0

      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")

      for (const [cat, kcal] of categorias) {
        const angulo = (kcal / totalCat) * 360
        const radInicio = (anguloInicio - 90) * (Math.PI / 180)
        const radFin = ((anguloInicio + angulo) - 90) * (Math.PI / 180)

        const x1 = cx + r * Math.cos(radInicio)
        const y1 = cy + r * Math.sin(radInicio)
        const x2 = cx + r * Math.cos(radFin)
        const y2 = cy + r * Math.sin(radFin)

        const grande = angulo > 180 ? 1 : 0

        doc.setFillColor(COLORES_CATEGORIA[cat] || "#94a3b8")
        doc.path([["M", cx, cy], ["L", x1, y1], ["A", r, r, 0, grande, 1, x2, y2], ["Z"]], "F")

        anguloInicio += angulo
      }

      doc.setFillColor("#fff")
      doc.circle(cx, cy, 10, "F")

      saltar(60)

      // Legend
      for (const [cat, kcal] of categorias) {
        const pct = Math.round((kcal / totalCat) * 100)
        doc.setFillColor(COLORES_CATEGORIA[cat] || "#94a3b8")
        doc.rect(20, y, 6, 6, "F")
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor("#475569")
        doc.text(`${cat} — ${kcal} kcal (${pct}%)`, 30, y + 5)
        saltar(8)
      }
    }
  }

  // --- FOOTER ---
  const paginas = doc.getNumberOfPages()
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor("#cbd5e1")
    doc.text(`Generado por Contador de Calorías · ${new Date().toLocaleDateString("es-ES")}`, 20, 290)
  }

  doc.save(`informe_${fecha}.pdf`)
}
