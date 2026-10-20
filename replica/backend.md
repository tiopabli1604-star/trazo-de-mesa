# Backend implementado

20-10-2026. **Ajuste de arquitectura para uso personal:** se sustituyó la propuesta de Supabase por un repositorio de publicaciones en archivos privados del servidor Node. Evita contratar servicios para completar y probar el editor. Los siete stores IndexedDB y el documento JSON siguen el plan. schema.sql se conserva como propuesta de migración a Supabase, sin ejecutar ni describir el backend activo.

Originales: IndexedDB del navegador. Publicaciones: PNG recodificados y meta.json en DATA_DIR, fuera del directorio público. La aplicación tiene una sola instancia; la cola serializa escrituras y revocaciones. El manifiesto se guarda mediante archivo temporal + rename, después de las imágenes. No es un repositorio apto para escalado horizontal.

## API activa

| Método/ruta | Acceso | Resultado |
| --- | --- | --- |
| GET /api/session | Mismo host configurado | Estado del acceso; sin secretos |
| POST /api/session | Origen exacto y contraseña propia | Cookie firmada de 12 h, HttpOnly, SameSite=Strict, Secure en HTTPS |
| DELETE /api/session | Origen exacto | Expira cookie del navegador |
| GET /api/publications | Propietario | Listado de publicaciones |
| POST /api/publications | Propietario y origen exacto | Subida acotada, validación y publicación atómica |
| GET /api/publications/[id] | Propietario | Estado y metadatos de una publicación |
| DELETE /api/publications/[id] | Propietario y origen exacto | Revocación persistente y borrado de PNG; idempotente |
| GET /api/share | Token de lectura en Authorization | Título y páginas de instantánea activa |
| GET /api/share/pages/[id] | Token activo y pertenencia | PNG privado servido sin caché |

Son 9 operaciones, frente a las 6 propuestas inicialmente. Se añade sesión/colección y se elimina finalize/subida firmada, pues el servidor valida y persiste en un único recorrido. Los enlaces usan fragmento `#token`; su contenido no se envía como URL de petición. El servidor guarda SHA-256 del token y no devuelve documentos editables.

Modo local: permitido solo cuando no hay APP_ORIGIN ni OWNER_PASSWORD y el host es 127.0.0.1:3000. En alojamiento: APP_ORIGIN exacto, contraseña propia y SESSION_SECRET de 32+ caracteres. Un host distinto falla cerrado. La comparación del host usa el encabezado recibido, porque Next puede reconstruir internamente una URL con localhost; el fallo inicial se reprodujo y corrigió. Ningún header reenviado del cliente decide el propietario.

## Comprobaciones

- [x] Variables secretas solo de servidor, .env.example sin valores y .env* excluido del código.
- [x] Validación Zod de metadatos, UUID y revisión; archivos acotados y recodificados con sharp.
- [x] Límite de solicitud 21 MiB; 10 páginas, 5 MiB/página, 20 MiB finales y 16 megapíxeles.
- [x] Rutas del propietario deniegan acceso sin sesión en modo alojado; prueba con credenciales sintéticas, sin cuentas externas.
- [x] Origen ajeno rechazado incluso con sesión válida; comprobado.
- [x] Token inválido y página ajena rechazados; revocación comprobada con sesión invitada.
- [x] Límites por proceso: login 6/min, publicación 10/min, propietario 60/min y lecturas 120/min. Son globales para esta instancia personal y no dependen de un encabezado IP falsificable.
- [x] Cookie con HttpOnly/SameSite y expiración; Secure cuando APP_ORIGIN usa HTTPS.
- [x] Auditoría de dependencias ejecutada; informe en dependency-audit.json. Se actualizó sharp a 0.35.5 para corregir el aviso encontrado.
- [x] Pago, email, OAuth, equipos y webhooks: no aplican al alcance individual.
- [ ] Disco persistente y copias del alojamiento externo: pendientes de elegir/provisionar un proveedor.
- [ ] TLS y prueba desde otro equipo en dominio público: pendientes de despliegue externo.

La cookie expira en el navegador al salir. Para invalidar todas las sesiones existentes, rotar SESSION_SECRET; no hay cuentas múltiples ni botón de salida global. La protección de lectura es por enlace: compartirlo concede acceso a quien lo tenga. No se pueden retirar copias ya descargadas.

No hay cron activo: una publicación inválida elimina su directorio durante el fallo; una caída del proceso puede dejar archivos sin manifiesto. El backend no los sirve. La limpieza de huérfanos y un índice transaccional son mejoras operativas antes de aumentar la carga. Borrar el navegador no revoca publicaciones; la interfaz lo explica y permite gestionarlas desde Ajustes.
