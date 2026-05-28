export async function pedirPermisoNotificaciones(): Promise<boolean> {
  if (!("Notification" in window)) return false
  const permiso = await Notification.requestPermission()
  return permiso === "granted"
}

export function enviarNotificacion(titulo: string, cuerpo: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return
  new Notification(titulo, { body: cuerpo, icon: "/calorie_counter/icon-192.png" })
}
