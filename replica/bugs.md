# Fallos reproducidos y correcciones

## B01 — S2 — Origen del lienzo desplazado

Pasos: abrir la plantilla botánica; comparar el texto y las formas con la vista previa. Esperado: origen superior izquierdo de los elementos. Observado: elementos desplazados y texto recortado, porque el valor predeterminado del motor era diferente al supuesto. Evidencia: primera captura S06 revisada visualmente. Corrección: originX/originY explícitos en makeObject. Regresión: geometry.spec.ts comprueba un píxel del rectángulo en coordenadas conocidas. Estado: corregido.

## B02 — S2 — Publicación rechazada en el host local válido

Pasos: Compartir → crear enlace. Esperado: publicación accesible; observado: 403 por comparar una URL reconstruida internamente con el origen externo. Corrección: validar host exacto y encabezado Origin contra la configuración; mantener autenticación independiente del host reconstruido. Regresión: publicación/invitado/revocación y comprobaciones de origen ajeno. Estado: corregido.

## B03 — S3 — Panel móvil ocupa el lienzo

Pasos: abrir editor a 390 px. Esperado: lienzo accesible y propiedades disponibles; observado: panel siempre visible reduce demasiado el espacio. Corrección: panel inicialmente cerrado en móvil, apertura por herramientas, cierre explícito y tamaño del lienzo recalculado. Evidencia: S06-mobile.png. Estado: corregido para el recorrido probado; edición de escritorio prioritaria.

## B04 — S2 — Bibliotecas nativas incompletas en standalone de Windows

Pasos: iniciar el paquete standalone después de compilar y solicitar /api/session. Esperado: 200; observado: 500 al cargar sharp porque faltaban bibliotecas nativas de libvips en el trazado de dependencias. Corrección: postbuild copia los paquetes instalados sharp y @img completos, además de public y .next/static. Se verifica con el servidor de producción y sus rutas; el empaquetado Docker se conserva preparado, sin afirmar ejecución en Docker. Estado: corregido en la entrega local.

## Ajustes de las pruebas

La primera ejecución incluía un PNG de prueba corrupto, selectores que confundían el anunciador de rutas con el aviso de la app y un selector de capa que conservaba el texto anterior tras editarlo. Se sustituyó el PNG por una imagen generada con sharp y se acotaron los selectores a sus regiones/roles. No se ocultaron errores de consola ni respuestas 5xx.

## Pendiente de comprobar

Escenarios listados en test-plan.md: Firefox/WebKit, lector de pantalla, cuota agotada y caída abrupta. No se presentan como bugs reproducidos. No quedan S1/S2 abiertos en los recorridos ejecutados. No hay commits de corrección: se entrega un proyecto fuente independiente, sin repositorio remoto ni historial Git creado.
