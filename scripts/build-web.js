const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..")
const PUBLIC = path.join(ROOT, "public")
const DIST = path.join(ROOT, "dist")

console.log("📦 Exportando app web...")
execSync("npx expo export --platform web", { cwd: ROOT, stdio: "inherit" })

console.log("📁 Copiando archivos PWA...")
const files = fs.readdirSync(PUBLIC)
files.forEach((file) => {
  const src = path.join(PUBLIC, file)
  const dst = path.join(DIST, file)
  fs.copyFileSync(src, dst)
  console.log(`   ${file} → dist/${file}`)
})

console.log("\n✅ Build completado. Abre dist/ con un servidor HTTP:")
console.log("   npx serve dist")
console.log("   o npm run serve:web")
