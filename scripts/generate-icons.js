const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const ASSETS = path.join(__dirname, "..", "assets", "images")
const SIZE = 1024
const PAD = Math.round(SIZE * 0.08)
const INNER = SIZE - PAD * 2
const R = Math.round(INNER * 0.28)

const bgGradient = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#22c55e"/>
        <stop offset="100%" style="stop-color:#3b82f6"/>
      </linearGradient>
    </defs>
    <rect width="${SIZE}" height="${SIZE}" rx="${SIZE * 0.2}" fill="url(#g)"/>
  </svg>`
)

const iconSvg = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#22c55e"/>
        <stop offset="100%" style="stop-color:#3b82f6"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect width="${SIZE}" height="${SIZE}" rx="${SIZE * 0.2}" fill="url(#g)"/>
    <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE * 0.32}" fill="white" filter="url(#s)"/>
    <text x="${SIZE / 2}" y="${SIZE / 2 + SIZE * 0.11}" font-family="system-ui, sans-serif" font-size="${SIZE * 0.28}" font-weight="800" fill="#3b82f6" text-anchor="middle">C</text>
  </svg>`
)

async function generate() {
  // Main icon
  await sharp(iconSvg)
    .resize(SIZE, SIZE)
    .png()
    .toFile(path.join(ASSETS, "icon.png"))
  console.log("icon.png generated")

  // Splash (lighter, simpler)
  const splashSvg = Buffer.from(
    `<svg width="${SIZE}" height="${SIZE}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#22c55e"/>
          <stop offset="100%" style="stop-color:#3b82f6"/>
        </linearGradient>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="#f0fdf4"/>
      <text x="${SIZE / 2}" y="${SIZE / 2 + SIZE * 0.12}" font-family="system-ui, sans-serif" font-size="${SIZE * 0.3}" font-weight="800" fill="#22c55e" text-anchor="middle">C</text>
    </svg>`
  )
  await sharp(splashSvg)
    .resize(SIZE, SIZE)
    .png()
    .toFile(path.join(ASSETS, "splash-icon.png"))
  console.log("splash-icon.png generated")

  // Android adaptive icon - foreground
  const fgSvg = Buffer.from(
    `<svg width="${SIZE}" height="${SIZE}">
      <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE * 0.32}" fill="#3b82f6"/>
      <text x="${SIZE / 2}" y="${SIZE / 2 + SIZE * 0.11}" font-family="system-ui, sans-serif" font-size="${SIZE * 0.28}" font-weight="800" fill="white" text-anchor="middle">C</text>
    </svg>`
  )
  await sharp(fgSvg)
    .resize(SIZE, SIZE)
    .png()
    .toFile(path.join(ASSETS, "android-icon-foreground.png"))
  console.log("android-icon-foreground.png generated")

  // Android adaptive icon - background
  const bgSvg = Buffer.from(
    `<svg width="${SIZE}" height="${SIZE}">
      <rect width="${SIZE}" height="${SIZE}" fill="#22c55e"/>
    </svg>`
  )
  await sharp(bgSvg)
    .resize(SIZE, SIZE)
    .png()
    .toFile(path.join(ASSETS, "android-icon-background.png"))
  console.log("android-icon-background.png generated")

  // Android monochrome
  const mono = Buffer.from(
    `<svg width="${SIZE}" height="${SIZE}">
      <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE * 0.32}" fill="white"/>
      <text x="${SIZE / 2}" y="${SIZE / 2 + SIZE * 0.11}" font-family="system-ui, sans-serif" font-size="${SIZE * 0.28}" font-weight="800" fill="#22c55e" text-anchor="middle">C</text>
    </svg>`
  )
  await sharp(mono)
    .resize(SIZE, SIZE)
    .png()
    .toFile(path.join(ASSETS, "android-icon-monochrome.png"))
  console.log("android-icon-monochrome.png generated")

  // Favicon (48x48)
  await sharp(iconSvg)
    .resize(48, 48)
    .png()
    .toFile(path.join(ASSETS, "favicon.png"))
  console.log("favicon.png generated")
}

generate().catch(console.error)
