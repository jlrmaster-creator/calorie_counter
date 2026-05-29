export type Salud = "verde" | "amarillo" | "rojo"

export interface Alimento {
  categoria: string
  nombre: string
  calorias: number
  salud?: Salud
  colesterolAlto?: boolean
}

export function getSalud(alimento: Alimento): Salud {
  const { categoria, nombre } = alimento

  if (categoria === "Verduras") return "verde"
  if (categoria === "Frutas") return "verde"
  if (categoria === "Legumbres") return "verde"
  if (categoria === "Pescados") return "verde"

  if (categoria === "Aceites") return "rojo"
  if (categoria === "Dulces") return "rojo"
  if (categoria === "Pastelería") return "rojo"

  if (categoria === "Carnes") {
    const procesadas = ["chorizo", "salami", "salchichón", "salchicha", "mortadela", "butifarra", "bacon", "chicharrón", "foie"]
    if (procesadas.some((p) => nombre.toLowerCase().includes(p))) return "rojo"
    return "amarillo"
  }

  if (categoria === "Bebidas") {
    const alcohol = ["cerveza", "vino", "whisky", "vodka", "ron", "ginebra", "coñac", "anís", "sidra", "champán", "vermouth"]
    if (alcohol.some((a) => nombre.toLowerCase().includes(a))) return "rojo"
    return "verde"
  }

  if (categoria === "Salsas") {
    if (nombre.toLowerCase().includes("mayonesa")) return "rojo"
    return "amarillo"
  }

  return "amarillo"
}

export function getColesterolAlto(alimento: Alimento): boolean {
  const { categoria, nombre } = alimento

  if (categoria === "Carnes") {
    const malos = ["chorizo", "salami", "salchichón", "salchicha", "mortadela", "butifarra", "bacon", "chicharrón", "foie", "jamón", "lomo embuchado", "hamburguesa", "tira de asado"]
    if (malos.some((m) => nombre.toLowerCase().includes(m))) return true
  }

  if (categoria === "Huevos" && (nombre.toLowerCase().includes("huevo") || nombre.toLowerCase().includes("yema"))) return true

  if (categoria === "Aceites") return true

  if (categoria === "Salsas" && nombre.toLowerCase().includes("mayonesa")) return true

  if (categoria === "Pastelería") return true

  if (categoria === "Dulces") return true

  if (categoria === "Lácteos") {
    const grasos = ["nata", "crema", "queso", "mousse", "helados lácteos", "leche condensada", "leche entera", "leche de oveja", "leche en polvo entera"]
    if (grasos.some((g) => nombre.toLowerCase().includes(g))) return true
  }

  if (categoria === "Pescados") {
    const mariscos = ["cangrejo", "langosta", "langostino", "gamba", "caviar"]
    if (mariscos.some((m) => nombre.toLowerCase().includes(m))) return true
  }

  return false
}

export const ALIMENTOS: Alimento[] = [
  // VERDURAS Y HORTALIZAS
  { categoria: "Verduras", nombre: "Aceitunas negras", calorias: 349 },
  { categoria: "Verduras", nombre: "Aceitunas verdes", calorias: 132 },
  { categoria: "Verduras", nombre: "Acelgas", calorias: 33 },
  { categoria: "Verduras", nombre: "Ajos", calorias: 169 },
  { categoria: "Verduras", nombre: "Alcachofas", calorias: 64 },
  { categoria: "Verduras", nombre: "Apio", calorias: 20 },
  { categoria: "Verduras", nombre: "Berenjena", calorias: 29 },
  { categoria: "Verduras", nombre: "Berros", calorias: 21 },
  { categoria: "Verduras", nombre: "Brócoli", calorias: 31 },
  { categoria: "Verduras", nombre: "Calabacín", calorias: 31 },
  { categoria: "Verduras", nombre: "Calabaza", calorias: 24 },
  { categoria: "Verduras", nombre: "Cebolla", calorias: 47 },
  { categoria: "Verduras", nombre: "Cebolla tierna", calorias: 39 },
  { categoria: "Verduras", nombre: "Champiñón", calorias: 28 },
  { categoria: "Verduras", nombre: "Col", calorias: 28 },
  { categoria: "Verduras", nombre: "Col de Bruselas", calorias: 54 },
  { categoria: "Verduras", nombre: "Coliflor", calorias: 30 },
  { categoria: "Verduras", nombre: "Endibia", calorias: 22 },
  { categoria: "Verduras", nombre: "Escarola", calorias: 37 },
  { categoria: "Verduras", nombre: "Espárragos", calorias: 26 },
  { categoria: "Verduras", nombre: "Espárragos en lata", calorias: 24 },
  { categoria: "Verduras", nombre: "Espinaca", calorias: 32 },
  { categoria: "Verduras", nombre: "Espinacas congeladas", calorias: 25 },
  { categoria: "Verduras", nombre: "Habas tiernas", calorias: 64 },
  { categoria: "Verduras", nombre: "Hinojo", calorias: 16 },
  { categoria: "Verduras", nombre: "Lechuga", calorias: 18 },
  { categoria: "Verduras", nombre: "Nabos", calorias: 29 },
  { categoria: "Verduras", nombre: "Papas cocidas", calorias: 86 },
  { categoria: "Verduras", nombre: "Pepino", calorias: 12 },
  { categoria: "Verduras", nombre: "Perejil", calorias: 55 },
  { categoria: "Verduras", nombre: "Pimiento", calorias: 22 },
  { categoria: "Verduras", nombre: "Porotos verdes", calorias: 21 },
  { categoria: "Verduras", nombre: "Puerros", calorias: 42 },
  { categoria: "Verduras", nombre: "Rábanos", calorias: 20 },
  { categoria: "Verduras", nombre: "Remolacha", calorias: 40 },
  { categoria: "Verduras", nombre: "Repollo", calorias: 19 },
  { categoria: "Verduras", nombre: "Rúcula", calorias: 37 },
  { categoria: "Verduras", nombre: "Brotes de soja", calorias: 50 },
  { categoria: "Verduras", nombre: "Tomate triturado en conserva", calorias: 39 },
  { categoria: "Verduras", nombre: "Tomates", calorias: 22 },
  { categoria: "Verduras", nombre: "Trufa", calorias: 92 },
  { categoria: "Verduras", nombre: "Zanahoria", calorias: 42 },
  { categoria: "Verduras", nombre: "Zumo de tomate", calorias: 21 },

  // FRUTAS
  { categoria: "Frutas", nombre: "Arándanos", calorias: 41 },
  { categoria: "Frutas", nombre: "Caqui", calorias: 64 },
  { categoria: "Frutas", nombre: "Cereza", calorias: 47 },
  { categoria: "Frutas", nombre: "Chirimoya", calorias: 78 },
  { categoria: "Frutas", nombre: "Ciruela", calorias: 44 },
  { categoria: "Frutas", nombre: "Ciruela seca", calorias: 290 },
  { categoria: "Frutas", nombre: "Coco", calorias: 646 },
  { categoria: "Frutas", nombre: "Dátil", calorias: 279 },
  { categoria: "Frutas", nombre: "Dátil seco", calorias: 306 },
  { categoria: "Frutas", nombre: "Frambuesa", calorias: 40 },
  { categoria: "Frutas", nombre: "Fresas", calorias: 36 },
  { categoria: "Frutas", nombre: "Granada", calorias: 65 },
  { categoria: "Frutas", nombre: "Grosella", calorias: 37 },
  { categoria: "Frutas", nombre: "Higos", calorias: 80 },
  { categoria: "Frutas", nombre: "Higos secos", calorias: 275 },
  { categoria: "Frutas", nombre: "Kiwi", calorias: 51 },
  { categoria: "Frutas", nombre: "Limón", calorias: 39 },
  { categoria: "Frutas", nombre: "Mandarina", calorias: 40 },
  { categoria: "Frutas", nombre: "Mango", calorias: 57 },
  { categoria: "Frutas", nombre: "Manzana", calorias: 52 },
  { categoria: "Frutas", nombre: "Melón", calorias: 31 },
  { categoria: "Frutas", nombre: "Mora", calorias: 37 },
  { categoria: "Frutas", nombre: "Naranja", calorias: 44 },
  { categoria: "Frutas", nombre: "Nectarina", calorias: 64 },
  { categoria: "Frutas", nombre: "Nísperos", calorias: 97 },
  { categoria: "Frutas", nombre: "Papaya", calorias: 45 },
  { categoria: "Frutas", nombre: "Pera", calorias: 61 },
  { categoria: "Frutas", nombre: "Piña", calorias: 51 },
  { categoria: "Frutas", nombre: "Piña en almíbar", calorias: 84 },
  { categoria: "Frutas", nombre: "Plátano", calorias: 90 },
  { categoria: "Frutas", nombre: "Pomelo", calorias: 30 },
  { categoria: "Frutas", nombre: "Sandía", calorias: 30 },
  { categoria: "Frutas", nombre: "Uva", calorias: 81 },
  { categoria: "Frutas", nombre: "Uva pasa", calorias: 324 },
  { categoria: "Frutas", nombre: "Zumo de fruta", calorias: 45 },
  { categoria: "Frutas", nombre: "Zumo de naranja", calorias: 42 },

  // FRUTOS SECOS
  { categoria: "Frutos secos", nombre: "Almendras", calorias: 620 },
  { categoria: "Frutos secos", nombre: "Avellanas", calorias: 675 },
  { categoria: "Frutos secos", nombre: "Castañas", calorias: 199 },
  { categoria: "Frutos secos", nombre: "Maní", calorias: 560 },
  { categoria: "Frutos secos", nombre: "Nueces", calorias: 660 },
  { categoria: "Frutos secos", nombre: "Piñones", calorias: 660 },
  { categoria: "Frutos secos", nombre: "Pistacho", calorias: 581 },

  // LÁCTEOS
  { categoria: "Lácteos", nombre: "Cuajada", calorias: 92 },
  { categoria: "Lácteos", nombre: "Flan de huevo", calorias: 126 },
  { categoria: "Lácteos", nombre: "Flan de vainilla", calorias: 102 },
  { categoria: "Lácteos", nombre: "Helados lácteos", calorias: 167 },
  { categoria: "Lácteos", nombre: "Leche condensada con azúcar", calorias: 350 },
  { categoria: "Lácteos", nombre: "Leche condensada sin azúcar", calorias: 160 },
  { categoria: "Lácteos", nombre: "Leche de cabra", calorias: 72 },
  { categoria: "Lácteos", nombre: "Leche de oveja", calorias: 96 },
  { categoria: "Lácteos", nombre: "Leche descremada", calorias: 36 },
  { categoria: "Lácteos", nombre: "Leche en polvo descremada", calorias: 373 },
  { categoria: "Lácteos", nombre: "Leche en polvo entera", calorias: 500 },
  { categoria: "Lácteos", nombre: "Leche entera", calorias: 68 },
  { categoria: "Lácteos", nombre: "Leche semidescremada", calorias: 49 },
  { categoria: "Lácteos", nombre: "Mousse", calorias: 177 },
  { categoria: "Lácteos", nombre: "Nata o crema de leche", calorias: 298 },
  { categoria: "Lácteos", nombre: "Queso blanco desnatado", calorias: 70 },
  { categoria: "Lácteos", nombre: "Queso Brie", calorias: 263 },
  { categoria: "Lácteos", nombre: "Queso Camembert", calorias: 312 },
  { categoria: "Lácteos", nombre: "Queso Cheddar", calorias: 381 },
  { categoria: "Lácteos", nombre: "Queso crema", calorias: 245 },
  { categoria: "Lácteos", nombre: "Queso de bola", calorias: 349 },
  { categoria: "Lácteos", nombre: "Queso de Burgos", calorias: 174 },
  { categoria: "Lácteos", nombre: "Queso de oveja", calorias: 245 },
  { categoria: "Lácteos", nombre: "Queso Edam", calorias: 306 },
  { categoria: "Lácteos", nombre: "Queso Emmental", calorias: 415 },
  { categoria: "Lácteos", nombre: "Queso fundido untable", calorias: 285 },
  { categoria: "Lácteos", nombre: "Queso Gruyere", calorias: 391 },
  { categoria: "Lácteos", nombre: "Queso manchego", calorias: 376 },
  { categoria: "Lácteos", nombre: "Queso Mozzarella", calorias: 245 },
  { categoria: "Lácteos", nombre: "Queso Parmesano", calorias: 393 },
  { categoria: "Lácteos", nombre: "Queso Ricota", calorias: 400 },
  { categoria: "Lácteos", nombre: "Queso Roquefort", calorias: 405 },
  { categoria: "Lácteos", nombre: "Requesón", calorias: 96 },
  { categoria: "Lácteos", nombre: "Yogur desnatado", calorias: 45 },
  { categoria: "Lácteos", nombre: "Yogur desnatado con frutas", calorias: 82 },
  { categoria: "Lácteos", nombre: "Yogur enriquecido con nata", calorias: 65 },
  { categoria: "Lácteos", nombre: "Yogur natural", calorias: 62 },
  { categoria: "Lácteos", nombre: "Yogur natural con fruta", calorias: 100 },

  // CARNES
  { categoria: "Carnes", nombre: "Bacon (panceta ahumada)", calorias: 665 },
  { categoria: "Carnes", nombre: "Butifarra cocida", calorias: 390 },
  { categoria: "Carnes", nombre: "Butifarra fresca", calorias: 326 },
  { categoria: "Carnes", nombre: "Cabrito", calorias: 127 },
  { categoria: "Carnes", nombre: "Cerdo chuleta", calorias: 330 },
  { categoria: "Carnes", nombre: "Cerdo hígado", calorias: 153 },
  { categoria: "Carnes", nombre: "Cerdo lomo", calorias: 208 },
  { categoria: "Carnes", nombre: "Chicharrón", calorias: 601 },
  { categoria: "Carnes", nombre: "Chorizo", calorias: 468 },
  { categoria: "Carnes", nombre: "Ciervo", calorias: 120 },
  { categoria: "Carnes", nombre: "Codorniz", calorias: 114 },
  { categoria: "Carnes", nombre: "Conejo", calorias: 162 },
  { categoria: "Carnes", nombre: "Cordero lechón", calorias: 105 },
  { categoria: "Carnes", nombre: "Cordero pierna", calorias: 98 },
  { categoria: "Carnes", nombre: "Cordero costillas", calorias: 215 },
  { categoria: "Carnes", nombre: "Cordero hígado", calorias: 132 },
  { categoria: "Carnes", nombre: "Faisán", calorias: 144 },
  { categoria: "Carnes", nombre: "Foie-Gras", calorias: 518 },
  { categoria: "Carnes", nombre: "Gallina", calorias: 369 },
  { categoria: "Carnes", nombre: "Hamburguesa", calorias: 230 },
  { categoria: "Carnes", nombre: "Jabalí", calorias: 107 },
  { categoria: "Carnes", nombre: "Jamón", calorias: 380 },
  { categoria: "Carnes", nombre: "Jamón cocido", calorias: 126 },
  { categoria: "Carnes", nombre: "Jamón crudo", calorias: 296 },
  { categoria: "Carnes", nombre: "Jamón York", calorias: 289 },
  { categoria: "Carnes", nombre: "Lengua de vaca", calorias: 191 },
  { categoria: "Carnes", nombre: "Lomo embuchado", calorias: 380 },
  { categoria: "Carnes", nombre: "Mortadela", calorias: 265 },
  { categoria: "Carnes", nombre: "Pato", calorias: 200 },
  { categoria: "Carnes", nombre: "Pavo muslo", calorias: 186 },
  { categoria: "Carnes", nombre: "Pavo pechuga", calorias: 134 },
  { categoria: "Carnes", nombre: "Perdiz", calorias: 120 },
  { categoria: "Carnes", nombre: "Pies de cerdo", calorias: 290 },
  { categoria: "Carnes", nombre: "Pollo hígado", calorias: 129 },
  { categoria: "Carnes", nombre: "Pollo muslo", calorias: 186 },
  { categoria: "Carnes", nombre: "Pollo pechuga", calorias: 134 },
  { categoria: "Carnes", nombre: "Salami", calorias: 325 },
  { categoria: "Carnes", nombre: "Salchicha Frankfurt", calorias: 315 },
  { categoria: "Carnes", nombre: "Salchichón", calorias: 294 },
  { categoria: "Carnes", nombre: "Ternera", calorias: 181 },
  { categoria: "Carnes", nombre: "Ternera chuleta", calorias: 168 },
  { categoria: "Carnes", nombre: "Ternera hígado", calorias: 140 },
  { categoria: "Carnes", nombre: "Ternera lengua", calorias: 207 },
  { categoria: "Carnes", nombre: "Ternera riñón", calorias: 86 },
  { categoria: "Carnes", nombre: "Ternera sesos", calorias: 125 },
  { categoria: "Carnes", nombre: "Ternera solomillo", calorias: 290 },
  { categoria: "Carnes", nombre: "Tira de asado", calorias: 401 },
  { categoria: "Carnes", nombre: "Relleno de pollo preparado", calorias: 72 },
  { categoria: "Carnes", nombre: "Tripas", calorias: 100 },
  { categoria: "Carnes", nombre: "Vacuno hígado", calorias: 129 },
  { categoria: "Carnes", nombre: "Albóndiga", calorias: 214 },
  { categoria: "Carnes", nombre: "Bistec de res", calorias: 146 },
  { categoria: "Carnes", nombre: "Bola de lomo", calorias: 121 },
  { categoria: "Carnes", nombre: "Carne de cerdo", calorias: 279 },
  { categoria: "Carnes", nombre: "Carne de res molida", calorias: 208 },
  { categoria: "Carnes", nombre: "Carne de vaca", calorias: 156 },
  { categoria: "Carnes", nombre: "Carne guisada", calorias: 113 },
  { categoria: "Carnes", nombre: "Carne mechada", calorias: 196 },
  { categoria: "Carnes", nombre: "Cecina", calorias: 410 },
  { categoria: "Carnes", nombre: "Chuletas de cordero", calorias: 298 },
  { categoria: "Carnes", nombre: "Cinta de lomo, adobada", calorias: 89 },
  { categoria: "Carnes", nombre: "Corned beef", calorias: 141 },
  { categoria: "Carnes", nombre: "Costilla de vaca", calorias: 241 },
  { categoria: "Carnes", nombre: "Filete de pechuga de pollo", calorias: 118 },
  { categoria: "Carnes", nombre: "Filete de pollo, a la plancha", calorias: 150 },
  { categoria: "Carnes", nombre: "Filete de ternera", calorias: 121 },
  { categoria: "Carnes", nombre: "Hamburguesa ternera", calorias: 143 },
  { categoria: "Carnes", nombre: "Lomo de cerdo", calorias: 106 },
  { categoria: "Carnes", nombre: "Milanesa de carne, al horno", calorias: 111 },
  { categoria: "Carnes", nombre: "Milanesa de carne, frita", calorias: 200 },
  { categoria: "Carnes", nombre: "Milanesa de pollo, al horno", calorias: 222 },
  { categoria: "Carnes", nombre: "Muslo de pollo, asado", calorias: 174 },
  { categoria: "Carnes", nombre: "Muslo de pollo, frito", calorias: 225 },
  { categoria: "Carnes", nombre: "Pata de res", calorias: 152 },
  { categoria: "Carnes", nombre: "Pierna de pollo, cocida", calorias: 218 },
  { categoria: "Carnes", nombre: "Queso de cerdo", calorias: 140 },

  // PESCADOS Y MARISCOS
  { categoria: "Pescados", nombre: "Almejas", calorias: 50 },
  { categoria: "Pescados", nombre: "Anchoas", calorias: 175 },
  { categoria: "Pescados", nombre: "Anguilas", calorias: 200 },
  { categoria: "Pescados", nombre: "Atún en lata (aceite)", calorias: 280 },
  { categoria: "Pescados", nombre: "Atún en lata (agua)", calorias: 127 },
  { categoria: "Pescados", nombre: "Atún fresco", calorias: 225 },
  { categoria: "Pescados", nombre: "Bacalao fresco", calorias: 74 },
  { categoria: "Pescados", nombre: "Bacalao seco", calorias: 322 },
  { categoria: "Pescados", nombre: "Besugo", calorias: 118 },
  { categoria: "Pescados", nombre: "Caballa", calorias: 153 },
  { categoria: "Pescados", nombre: "Calamar", calorias: 82 },
  { categoria: "Pescados", nombre: "Cangrejo", calorias: 85 },
  { categoria: "Pescados", nombre: "Caviar", calorias: 233 },
  { categoria: "Pescados", nombre: "Congrio", calorias: 112 },
  { categoria: "Pescados", nombre: "Dorada", calorias: 80 },
  { categoria: "Pescados", nombre: "Gallo", calorias: 73 },
  { categoria: "Pescados", nombre: "Gambas", calorias: 96 },
  { categoria: "Pescados", nombre: "Langosta", calorias: 67 },
  { categoria: "Pescados", nombre: "Langostino", calorias: 96 },
  { categoria: "Pescados", nombre: "Lenguado", calorias: 73 },
  { categoria: "Pescados", nombre: "Lubina", calorias: 118 },
  { categoria: "Pescados", nombre: "Lucio", calorias: 81 },
  { categoria: "Pescados", nombre: "Mejillón", calorias: 74 },
  { categoria: "Pescados", nombre: "Merluza", calorias: 86 },
  { categoria: "Pescados", nombre: "Mero", calorias: 118 },
  { categoria: "Pescados", nombre: "Ostras", calorias: 80 },
  { categoria: "Pescados", nombre: "Pejerrey", calorias: 87 },
  { categoria: "Pescados", nombre: "Pez espada", calorias: 109 },
  { categoria: "Pescados", nombre: "Pulpo", calorias: 57 },
  { categoria: "Pescados", nombre: "Rodaballo", calorias: 81 },
  { categoria: "Pescados", nombre: "Salmón", calorias: 172 },
  { categoria: "Pescados", nombre: "Salmón ahumado", calorias: 154 },
  { categoria: "Pescados", nombre: "Salmonete", calorias: 97 },
  { categoria: "Pescados", nombre: "Sardina en lata", calorias: 192 },
  { categoria: "Pescados", nombre: "Sardinas", calorias: 151 },
  { categoria: "Pescados", nombre: "Trucha", calorias: 94 },

  // HUEVOS
  { categoria: "Huevos", nombre: "Clara de huevo", calorias: 48 },
  { categoria: "Huevos", nombre: "Huevo duro", calorias: 147 },
  { categoria: "Huevos", nombre: "Huevo entero", calorias: 162 },
  { categoria: "Huevos", nombre: "Yema", calorias: 368 },

  // CEREALES Y DERIVADOS
  { categoria: "Cereales", nombre: "Arroz blanco", calorias: 354 },
  { categoria: "Cereales", nombre: "Arroz integral", calorias: 350 },
  { categoria: "Cereales", nombre: "Avena", calorias: 367 },
  { categoria: "Cereales", nombre: "Cebada", calorias: 373 },
  { categoria: "Cereales", nombre: "Centeno", calorias: 350 },
  { categoria: "Cereales", nombre: "Cereales con chocolate", calorias: 358 },
  { categoria: "Cereales", nombre: "Cereales con miel", calorias: 386 },
  { categoria: "Cereales", nombre: "Copos de maíz", calorias: 350 },
  { categoria: "Cereales", nombre: "Harina de maíz", calorias: 349 },
  { categoria: "Cereales", nombre: "Harina integral", calorias: 340 },
  { categoria: "Cereales", nombre: "Harina refinada", calorias: 353 },
  { categoria: "Cereales", nombre: "Pan de centeno", calorias: 241 },
  { categoria: "Cereales", nombre: "Pan de trigo blanco", calorias: 255 },
  { categoria: "Cereales", nombre: "Pan integral", calorias: 239 },
  { categoria: "Cereales", nombre: "Pan de molde blanco", calorias: 233 },
  { categoria: "Cereales", nombre: "Pan de molde integral", calorias: 216 },
  { categoria: "Cereales", nombre: "Pasta al huevo", calorias: 368 },
  { categoria: "Cereales", nombre: "Pasta de sémola", calorias: 361 },
  { categoria: "Cereales", nombre: "Polenta", calorias: 358 },
  { categoria: "Cereales", nombre: "Sémola de trigo", calorias: 368 },
  { categoria: "Cereales", nombre: "Yuca", calorias: 338 },
  { categoria: "Cereales", nombre: "Tortillas de maíz", calorias: 227 },
  { categoria: "Cereales", nombre: "Tortillas de trigo", calorias: 220 },
  { categoria: "Cereales", nombre: "Tortillas integrales", calorias: 269 },

  // LEGUMBRES
  { categoria: "Legumbres", nombre: "Garbanzos", calorias: 361 },
  { categoria: "Legumbres", nombre: "Judías", calorias: 343 },
  { categoria: "Legumbres", nombre: "Lentejas", calorias: 336 },

  // AZÚCARES Y DULCES
  { categoria: "Dulces", nombre: "Azúcar", calorias: 380 },
  { categoria: "Dulces", nombre: "Cacao en polvo instantáneo", calorias: 366 },
  { categoria: "Dulces", nombre: "Caramelos", calorias: 378 },
  { categoria: "Dulces", nombre: "Chocolate con leche", calorias: 550 },
  { categoria: "Dulces", nombre: "Chocolate sin leche", calorias: 530 },
  { categoria: "Dulces", nombre: "Crema de chocolate con avellanas", calorias: 549 },
  { categoria: "Dulces", nombre: "Dulce de membrillo", calorias: 215 },
  { categoria: "Dulces", nombre: "Helados de agua", calorias: 139 },
  { categoria: "Dulces", nombre: "Mermelada con azúcar", calorias: 280 },
  { categoria: "Dulces", nombre: "Mermelada sin azúcar", calorias: 145 },
  { categoria: "Dulces", nombre: "Miel", calorias: 300 },

  // PASTELERÍA
  { categoria: "Pastelería", nombre: "Bizcocho", calorias: 456 },
  { categoria: "Pastelería", nombre: "Croissant de chocolate", calorias: 469 },
  { categoria: "Pastelería", nombre: "Croissant", calorias: 456 },
  { categoria: "Pastelería", nombre: "Galletas de chocolate", calorias: 524 },
  { categoria: "Pastelería", nombre: "Galletas de mantequilla", calorias: 397 },
  { categoria: "Pastelería", nombre: "Galletas saladas", calorias: 464 },
  { categoria: "Pastelería", nombre: "Magdalenas", calorias: 469 },
  { categoria: "Pastelería", nombre: "Pasta de hojaldre", calorias: 565 },
  { categoria: "Pastelería", nombre: "Pastel de manzana", calorias: 311 },
  { categoria: "Pastelería", nombre: "Pastel de manzana (hojaldre)", calorias: 456 },
  { categoria: "Pastelería", nombre: "Pastel de queso", calorias: 414 },

  // BEBIDAS
  { categoria: "Bebidas", nombre: "Agua ardiente", calorias: 280 },
  { categoria: "Bebidas", nombre: "Agua tónica", calorias: 34 },
  { categoria: "Bebidas", nombre: "Anís", calorias: 312 },
  { categoria: "Bebidas", nombre: "Batido de cacao", calorias: 100 },
  { categoria: "Bebidas", nombre: "Cacao en polvo sin azúcar", calorias: 439 },
  { categoria: "Bebidas", nombre: "Café", calorias: 1 },
  { categoria: "Bebidas", nombre: "Cerveza negra", calorias: 37 },
  { categoria: "Bebidas", nombre: "Cerveza rubia", calorias: 45 },
  { categoria: "Bebidas", nombre: "Champán seco", calorias: 85 },
  { categoria: "Bebidas", nombre: "Champán dulce", calorias: 118 },
  { categoria: "Bebidas", nombre: "Coñac", calorias: 243 },
  { categoria: "Bebidas", nombre: "Ginebra", calorias: 244 },
  { categoria: "Bebidas", nombre: "Leche de almendras", calorias: 335 },
  { categoria: "Bebidas", nombre: "Refrescos carbonatados", calorias: 48 },
  { categoria: "Bebidas", nombre: "Ron", calorias: 244 },
  { categoria: "Bebidas", nombre: "Sidra dulce", calorias: 33 },
  { categoria: "Bebidas", nombre: "Sidra seca", calorias: 35 },
  { categoria: "Bebidas", nombre: "Té", calorias: 1 },
  { categoria: "Bebidas", nombre: "Vermouth dulce", calorias: 160 },
  { categoria: "Bebidas", nombre: "Vino de mesa", calorias: 70 },
  { categoria: "Bebidas", nombre: "Vino dulce", calorias: 160 },
  { categoria: "Bebidas", nombre: "Vodka", calorias: 315 },
  { categoria: "Bebidas", nombre: "Whisky", calorias: 244 },

  // ACEITES Y GRASAS
  { categoria: "Aceites", nombre: "Aceite de girasol", calorias: 900 },
  { categoria: "Aceites", nombre: "Aceite de oliva", calorias: 900 },
  { categoria: "Aceites", nombre: "Manteca", calorias: 670 },
  { categoria: "Aceites", nombre: "Mantequilla", calorias: 752 },
  { categoria: "Aceites", nombre: "Margarina vegetal", calorias: 752 },

  // SALSAS
  { categoria: "Salsas", nombre: "Bechamel", calorias: 115 },
  { categoria: "Salsas", nombre: "Ketchup", calorias: 98 },
  { categoria: "Salsas", nombre: "Mayonesa", calorias: 718 },
  { categoria: "Salsas", nombre: "Mayonesa light", calorias: 374 },
  { categoria: "Salsas", nombre: "Mostaza", calorias: 15 },
  { categoria: "Salsas", nombre: "Salsa de soja", calorias: 61 },
  { categoria: "Salsas", nombre: "Salsa de tomate", calorias: 86 },
  { categoria: "Salsas", nombre: "Sofrito", calorias: 116 },
  { categoria: "Salsas", nombre: "Vinagres", calorias: 8 },
]

export const CATEGORIAS = [
  ...new Set(ALIMENTOS.map((a) => a.categoria)),
]

export function buscarAlimentos(query: string): Alimento[] {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return ALIMENTOS.filter((a) =>
    a.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q)
  ).slice(0, 50)
}
