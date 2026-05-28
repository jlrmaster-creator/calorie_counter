# 📱 Product Requirements Document (PRD)

## App de Conteo de Calorías (Open Source)

---

# 1. 🧭 Visión del Producto

## 1.1 Objetivo

Desarrollar una aplicación móvil open source que permita a los usuarios **controlar su ingesta calórica diaria de forma rápida, visual y motivadora**, comparándola con objetivos personalizados según su dieta.

## 1.2 Propuesta de Valor

* Simplicidad extrema (input en segundos)
* Feedback inmediato y visual
* Enfoque en adherencia (no solo datos)
* 100% open source (transparencia y extensibilidad)

---

# 2. 👤 Usuarios Objetivo

## 2.1 Segmentos

* Personas en dieta (pérdida de peso)
* Usuarios fitness (ganancia muscular / control)
* Usuarios casuales que quieren hábitos saludables

## 2.2 Necesidades clave

* Saber si están cumpliendo su dieta
* Registrar calorías sin fricción
* Visualizar progreso fácilmente
* Mantener motivación diaria

---

# 3. 🎯 Problema

Las apps actuales:

* Son complejas o lentas
* Requieren demasiado input manual
* No motivan de forma efectiva
* Tienen UX sobrecargada

---

# 4. 🧩 Solución

Una app móvil que:

* Permite registrar calorías por comida en segundos
* Calcula automáticamente el estado diario
* Muestra progreso con visualizaciones claras
* Gamifica el cumplimiento

---

# 5. 🧱 Funcionalidades

## 5.1 Core (MVP)

### A. Registro de calorías

* Input por comidas:

  * Desayuno
  * Almuerzo
  * Comida
  * Merienda
  * Cena
* Input manual simple (número de calorías)

### B. Objetivo calórico

* Definición de objetivo diario
* Cálculo automático:

  * Total consumido
  * Diferencia vs objetivo

### C. Estado del día

* Estados:

  * ✅ Dentro del objetivo
  * ⚠️ Cercano al límite
  * ❌ Exceso

---

## 5.2 Visualización

* Barra de progreso diaria
* Gráfico semanal
* Histórico mensual

---

## 5.3 Sistema de dietas

* Selección de dieta:

  * Hipocalórica
  * Keto
  * Mediterránea
  * Alta en proteínas

* Ajustes automáticos:

  * Rango calórico sugerido
  * Recomendaciones básicas

---

## 5.4 Gamificación

* Logros:

  * X días consecutivos cumpliendo
* Sistema de feedback:

  * Mensajes positivos
  * Alertas cuando se excede
* Rachas (streaks)

---

## 5.5 UX/UI

* Diseño minimalista
* Navegación de 1–2 taps
* Modo oscuro
* Tipografía legible
* Colores semánticos:

  * Verde (correcto)
  * Rojo (exceso)

---

# 6. 🚀 Funcionalidades Futuras

* Escaneo de alimentos
* Integración con APIs open food
* IA para estimación de calorías
* Integración con wearables
* Social (compartir progreso)

---

# 7. 🏗️ Arquitectura Técnica

## 7.1 Stack Tecnológico (Open Source)

### Frontend

* React Native o Flutter

### Backend

* Node.js (Express) o Django

### Base de datos

* SQLite (local)
* PostgreSQL (cloud opcional)

### Visualización

* Chart.js / Recharts

---

## 7.2 Arquitectura

* Arquitectura modular (Clean Architecture)
* Separación:

  * UI
  * Lógica de negocio
  * Persistencia (base de datos firebase)
  * Repositorio GitHub

---

## 7.3 Modelo de Datos

### Usuario

* id
* objetivo_calorias
* dieta

### Registro diario

* fecha
* total_calorias

### Comidas

* tipo (desayuno, etc.)
* calorias
* timestamp

---

# 8. 📊 Métricas de Éxito

## 8.1 Producto

* Retención diaria (D1, D7)
* Nº de registros diarios por usuario
* % de usuarios que completan el día

## 8.2 Engagement

* Rachas medias
* Uso de gráficos

---

# 9. 🧪 UX Flows

## 9.1 Flujo principal

1. Usuario abre app
2. Introduce calorías por comida
3. Visualiza progreso
4. Recibe feedback

Tiempo objetivo: < 10 segundos por input

---

# 10. 🔐 Privacidad

* Datos locales por defecto
* Sin venta de datos
* Sin tracking invasivo
* Cumplimiento GDPR

---

# 11. ⚠️ Riesgos

* Baja adherencia del usuario
* Input manual repetitivo
* Falta de diferenciación

### Mitigación

* Gamificación
* UX ultra rápida
* Feedback constante

---

# 12. 📦 Roadmap

## Fase 1 (MVP)

* Registro calorías
* Objetivo diario
* Visualización básica

## Fase 2

* Dietas
* Gamificación

## Fase 3

* IA
* Integraciones externas

---

# 13. 🎨 Diseño (Principios)

* “Menos es más”
* Enfoque mobile-first
* Feedback inmediato
* Evitar fricción

---

# 14. 🧾 Requisitos No Funcionales

* Rendimiento alto
* Offline-first
* Escalable
* Código mantenible

---

# 15. 🧠 Diferenciación

* Ultra simple vs apps complejas
* Open source
* Enfoque en comportamiento (no solo tracking)

---

# 16. ✅ Definición de Éxito

Un usuario debe poder:

* Registrar su día completo en < 1 minuto
* Entender su estado en < 2 segundos
* Mantener uso durante semanas

---

# 17. 🏁 Conclusión

Este producto se centra en:

* Simplicidad
* Consistencia
* Motivación

El éxito no depende solo del tracking, sino de la **adherencia del usuario en el tiempo**.

---
