# Despliegue: edición personal

Estado: aplicación construida y probada en local. Se entrega código, lockfile, Dockerfile, arranque de producción y configuración de ejemplo. **No se ha publicado un sitio en internet**, comprado un dominio ni creado servicios externos.

## Comprobaciones previas

| Comprobación | Resultado |
| --- | --- |
| Playwright | 11 tests aprobados en standalone de producción, reportados en browser-test-results.json |
| Contrato de documento | 5 tests aprobados |
| Acceso alojado simulado | 6 comprobaciones aprobadas con datos sintéticos en instancia local de producción |
| Matriz funcional | 30 capacidades del alcance marcadas implementadas; 23 imprescindibles; ver límites en parity.md |
| Comparación visual con original | No ejecutada: faltan capturas comparables; sin puntuación inventada |
| Contraste | 15 pares, cero fallos AA en tokens |
| Axe | Sin infracciones detectadas en las pantallas incluidas en la suite; no certificación manual completa |
| Marca | Barrido limpio y búsqueda adicional por palabra completa sin coincidencias; nombre provisional, sin autorización marcaria |
| Fichas de tienda | Lint sin errores ni advertencias; borradores, sin envío ni binario móvil |
| Dependencias | npm audit completo: cero vulnerabilidades conocidas en el informe final |
| Producción | npm run build y preparación standalone; servidor Node local |
| Privacidad y condiciones | /privacy y /terms disponibles; completar responsable/proveedor antes de apertura pública |
| Cobros, OAuth, email, cookies de marketing | No aplican; sin analítica ni publicidad |

## Uso local

Desde trazo: `npm ci`, `npm run build`, `npm start`. Abrir http://127.0.0.1:3000. Abrir estudio.cmd facilita el modo de desarrollo. El backend local y los documentos locales son reales; no se depende de servicios de Canva ni de cuentas en nube.

## Configuración de alojamiento preparada

Una sola instancia Node/Docker, con volumen persistente `/data` y HTTPS. Establecer APP_ORIGIN al origen final exacto, OWNER_PASSWORD propia y SESSION_SECRET aleatorio de al menos 32 caracteres. DATA_DIR debe apuntar al volumen. El backend deniega administración remota cuando falta configuración. No exponer .data como contenido estático ni ejecutar réplicas múltiples de este repositorio de archivos.

Dockerfile y .env.example están en la aplicación. Un proxy delante del servidor debe admitir hasta 21 MiB y conservar el Host de la dirección configurada. Respaldar el volumen de publicaciones; los originales editables no están en él y requieren respaldos del navegador.

No se han inventado registros DNS: el destino A/CNAME y verificaciones dependen del alojamiento que se elija. El dominio, URL pública, TLS externo y proveedor siguen sin configurar. El esquema Supabase se conserva como propuesta alternativa; no es necesario para arrancar esta edición ni ha sido aplicado.

## Validación antes de abrir a terceros

Elegir/provisionar servidor y dominio, comprobar el volumen y restauración de copia, configurar HTTPS/variables, iniciar sesión, crear un enlace, abrirlo desde otro dispositivo y revocarlo. Revisar privacidad con proveedor/responsable. Acordar el nombre comercial si se deja de usar como herramienta privada. Añadir monitorización y un procedimiento de limpieza de archivos huérfanos antes de aumentar la carga.

La skill [replica-deploy](C:/Users/tiopa/.codex/skills/replica-deploy/SKILL.md) exige: “Nothing goes live without the user's go. Show the preflight results and ask.” Estos resultados dejan preparada esa decisión. No se pide comprar ni configurar servicios para usar el estudio local.

## Primera semana de uso

Descargar respaldos después de trabajos importantes, comprobar reapertura y espacio del navegador, y revisar los enlaces activos desde Ajustes. Un enlace de localhost solo puede abrirse donde ese servidor sea accesible. Revocar no retira archivos ya descargados. El PDF es rasterizado y la edición no sincroniza dispositivos ni instala una copia offline de la aplicación.
