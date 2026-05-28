import { ScrollViewStyleReset } from "expo-router/html"
import type { ReactNode } from "react"

const BASE = "/calorie_counter"

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Calorías" />
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/icon-192.png`} />
        <link rel="apple-touch-startup-image" href={`${BASE}/icon-512.png`} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("${BASE}/sw.js", { scope: "${BASE}/" });
  });
}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

const responsiveBackground = `
body { background-color: #f8fafc; }
@media (prefers-color-scheme: dark) {
  body { background-color: #0f172a; }
}`
