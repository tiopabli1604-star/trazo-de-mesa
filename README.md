# Trazo de Mesa

Editor personal de diseños estáticos. Plantillas originales, texto, formas, imágenes propias, páginas, deshacer/rehacer, guardado en IndexedDB, respaldo ZIP, PNG/JPG/PDF y publicaciones revocables de lectura.

## Abrir en Windows

Desde esta carpeta, con Node.js 24:

```powershell
npm ci
npm run build
npm start
```

Abrir http://127.0.0.1:3000. Para desarrollo: `npm run dev`.

## Datos

Los originales se guardan en el perfil del navegador, vinculados al origen exacto. Descarga respaldos antes de borrar datos del navegador o cambiar de dominio/puerto. No hay sincronización en nube ni instalador offline. El PDF rasteriza las páginas; no es un PDF vectorial ni contiene texto seleccionable.

Las publicaciones se guardan en `.data/` del servidor, fuera de `public/`. Un enlace de localhost solo funciona donde ese servidor sea accesible. Revocar bloquea lecturas futuras; no retira copias ya descargadas.

## Alojamiento con una instancia Node

Configurar las variables de `.env.example`: `APP_ORIGIN` (origen HTTPS exacto), `OWNER_PASSWORD` (contraseña larga propia), `SESSION_SECRET` (aleatorio de 32 caracteres o más), `DATA_DIR` (directorio persistente). No enviar estos valores al cliente. La edición no exige cuenta; el propietario inicia sesión en Ajustes para publicar y revocar.

Dockerfile preparado para Node 24 y un volumen `/data`. Configurar proxy HTTPS, límite de cuerpo de 21 MiB y una sola instancia: el bloqueo de publicaciones y los límites de solicitudes son del proceso. No alojar el backend en almacenamiento efímero ni ejecutar varias instancias sin sustituir el repositorio por una base transaccional. El SQL del dossier es una propuesta Supabase; esta edición usa archivos persistentes y no ejecuta esa migración.

## Comprobar

```powershell
npm run typecheck
npm test
npm run build
```

Las pruebas Playwright usan datos sintéticos y el servidor local. Instalar Chromium con `npx playwright install chromium` si falta. Guardan capturas en la carpeta `replica/clone-screens/`.

Privacidad y condiciones se incluyen en `/privacy` y `/terms`. Antes de una publicación pública, completar proveedor/responsable, dominio y verificación operativa. No se ha publicado en internet ni enviado a tiendas.

Consultar el dossier en `replica/` para decisiones, límites, pruebas y estado de cada fase. El código y las seis plantillas se crearon para esta entrega. Las dependencias conservan sus licencias; consultar `THIRD_PARTY.md`.


Carpeta de trabajo: `C:\Users\tiopa\Apps\trazo-de-mesa`. El dossier Replica forma parte del repositorio en `replica/`.
