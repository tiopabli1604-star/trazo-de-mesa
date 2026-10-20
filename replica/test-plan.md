# Pruebas de la edición personal

Suite automatizada en trazo/e2e y trazo/tests. Datos sintéticos; no se prueban ni automatizan servidores del producto de referencia. Chromium local, 1440×900 y 390×844. La suite final completa se ejecutó contra el servidor standalone de producción en Windows (11/11), además de las ejecuciones de desarrollo. axe comprueba WCAG A/AA en las pantallas incluidas; no sustituye una auditoría manual de lector de pantalla.

| Caso | Escenario y resultado esperado | Evidencia |
| --- | --- | --- |
| F01-H1 | Buscar/previsualizar plantilla y crear documento independiente | flows.spec.ts |
| F01-E1 | Búsqueda sin resultados y regreso a galería | flows.spec.ts |
| F01-E2 | Inicio/editor móvil sin desbordamiento horizontal; axe | flows.spec.ts + capturas |
| F02-H1 | Texto con acentos y emoji, X y rotación; guardar y recargar | flows.spec.ts |
| F02-E1 | Duplicar, deshacer, rehacer y eliminar selección | flows.spec.ts |
| F03-H1 | Subir PNG propio y disponer del elemento | flows.spec.ts |
| F03-N1 | Archivo de texto rechazado con error recuperable | flows.spec.ts |
| F04-H1 | Añadir forma y mostrar propiedades | flows.spec.ts |
| F05-H1 | Duplicar página y añadir una tercera independiente | flows.spec.ts |
| F06-H1 | Descargar respaldo con imagen e importarlo como documento nuevo | flows.spec.ts |
| F06-E1 | Dos pestañas: una revisión antigua no pisa la nueva | flows.spec.ts |
| F07-H1 | PDF de tres páginas, PNG y JPG con extensiones correctas | flows.spec.ts |
| F07-E1 | Exportar solo las páginas elegidas | flows.spec.ts |
| F07-E2 | Comprobar píxel de forma en posición esperada, alfa PNG y blanco JPG | geometry.spec.ts |
| F08-H1 | Crear enlace; sesión invitada lee PNG, sin JSON editable | flows.spec.ts |
| F08-N1 | Página ajena, token inválido y origen ajeno denegados | flows.spec.ts |
| F08-E2 | Reintento con mismo contenido devuelve la misma publicación; contenido alterado da conflicto; borrado repetido seguro | publication.spec.ts |
| F08-E1 | Revocar y recargar: lectura denegada | flows.spec.ts |
| S03-H1 | Crear carpeta, mover diseño y duplicar documento | flows.spec.ts |
| S02-H1 | Primitivas, ajustes y colección sin infracciones axe detectadas | flows.spec.ts |
| AUTH-01…06 | Lectura anónima denegada, contraseña incorrecta, sesión HttpOnly/Strict, acceso válido, CSRF y logout | hosted-auth-results.json |
| DOC-01…05 | Plantillas válidas, copias independientes, IDs únicos, dimensiones/valores finitos y grupos copiados | document.test.ts |

Los 11 tests de navegador agrupan varios casos de esta tabla. Hay además 5 tests del contrato de documento y 6 comprobaciones HTTP de una instancia local de producción con credenciales sintéticas. Los reportes JSON conservan resultados sin datos de sesión.

## Casos pendientes y límites

Firefox/WebKit no ejecutados. No se ha hecho validación con lector de pantalla real, cargas extremas de 50 páginas, agotamiento real de cuota, caída abrupta durante una escritura, ni certificación de importación de ZIP hostiles. La suite verifica fallos de contrato y límites de código, pero esos escenarios merecen pruebas adicionales antes de una apertura pública. Las interacciones multipuntero y el agrupado complejo/anidado no forman parte de esta edición.

El almacenamiento local no sincroniza dispositivos. La carga totalmente offline no está implementada. El PDF es rasterizado. No hay pago, email, zona horaria de reservas, OAuth ni datos de un segundo usuario remoto: solo un propietario y destinatarios con enlaces.
