# Recon: Canva web para uso propio

Fecha: 20 de octubre de 2026. Alcance confirmado: elegir plantilla, editar textos, imágenes y elementos, guardar, exportar y compartir. Público: una persona, uso propio. Propuesta de primera versión: diseños estáticos, con documentos de varias páginas del mismo tamaño. No se ha construido una aplicación en esta fase.

## Fuentes y calidad de la evidencia

| ID | Fuente pública | Qué permite afirmar |
| --- | --- | --- |
| R01 | [Inicio](https://www.canva.com/) | Contexto del producto y acceso público |
| R02 | [Crear desde plantillas](https://www.canva.com/help/use-templates/) | Buscar, previsualizar y abrir una plantilla; acceso desde inicio o editor |
| R03 | [Editar y diseñar](https://www.canva.com/help/editing-designing/) | Familias de herramientas: elementos, texto, páginas y capas |
| R04 | [Añadir y editar texto](https://www.canva.com/help/add-and-edit-text/) | Edición de cajas, duplicado, eliminación y formato |
| R05 | [Añadir imágenes](https://www.canva.com/help/add-images/) | Biblioteca, imágenes propias y sustitución |
| R06 | [Subir archivos](https://www.canva.com/help/upload-media/) | Panel de subidas, selector de archivos y arrastre |
| R07 | [Descargar diseños](https://www.canva.com/help/download-or-purchase/) | Descarga, formatos, páginas y errores documentados |
| R08 | [Compartir](https://www.canva.com/help/share-via-link-or-email-variantb/) | Acceso privado inicial y permisos de enlaces |
| R09 | [Organizar diseños](https://www.canva.com/help/organize-your-designs/) | Organización de proyectos y miniaturas |
| R10 | [Planes](https://www.canva.com/pricing/) | Separación entre herramientas básicas y prestaciones de pago |
| R11 | [Referencia de API pública](https://www.canva.dev/docs/apps/rest-apis/reference/) | Dominios públicos de diseños, archivos, carpetas y exportaciones |
| R12 | [Condiciones](https://www.canva.com/policies/terms-of-use/) | Restricciones de acceso y uso del servicio |

Lectura documental, sin sesión de Canva, sin inspección del código ni de APIs privadas. No hay capturas del editor ni medición de interacciones reales. Los enlaces de ayuda documentan funciones; no demuestran que la interfaz actual sea idéntica para todas las cuentas. Una dirección de ayuda sobre guardado no pudo abrirse; su funcionamiento exacto queda pendiente.

Leyenda: **D** = documentado públicamente; **I** = inferencia o propuesta para la versión propia; **V** = observado visualmente en una sesión. No hay estados V en este informe. La confianza sobre el modelo de datos mide su utilidad para diseñar la aplicación, no conocimiento de la implementación de Canva.

## Flujo central

Convertir una plantilla propia en una pieza visual personalizada, conservar el documento editable y obtener un archivo o enlace de lectura.

Para uso individual propongo guardado local persistente con copia de seguridad exportable. Si se necesita acceso desde distintos dispositivos, arquitectura deberá añadir almacenamiento privado remoto. Un enlace compartible requiere una publicación o servicio accesible al destinatario; un archivo local no basta. Compartir queda en el alcance, con solo lectura como primera implementación propuesta.

## Inventario de pantallas y superficies

Son 13 superficies lógicas: varias son paneles o diálogos del mismo editor. Los accesos son recorridos documentados, no rutas internas inventadas.

| ID | Pantalla / acceso | Objetivo y componentes | Evidencia | Estados documentados / por validar |
| --- | --- | --- | --- | --- |
| S01 | Inicio público: canva.com | Descubrimiento, navegación, entrada | R01 D | Texto público accesible; diseño visual sin validar |
| S02 | Acceso desde inicio | Identificar propietario; diálogo de acceso propuesto para remoto | R01 D; solución I | Inicio de sesión y errores sin validar; prescindible en modo local |
| S03 | Proyectos desde inicio | Reabrir documentos; tarjetas y miniaturas | R09 D | Organización documentada; vacío, carga y error por validar |
| S04 | Plantillas desde navegación o búsqueda | Buscar y filtrar; rejilla y categorías | R02 D | Resultados documentados; sin resultados y carga por validar |
| S05 | Seleccionar plantilla | Previsualizar y personalizar | R02 D | Previsualización documentada; fallo por validar |
| S06 | Editor al personalizar o crear | Lienzo, selección y barra contextual | R02–R05 D; composición I | Edición documentada; vacío, selección y carga por validar |
| S07 | Editor: herramientas de texto | Contenido, familia, tamaño y color | R04 D | Editar, duplicar y eliminar documentados; fuente ausente por validar |
| S08 | Editor: elementos / imágenes | Buscar e insertar recursos | R03/R05 D | Búsqueda y sustitución documentadas; sin resultados por validar |
| S09 | Editor: subidas | Selector, zona de arrastre, miniaturas | R06 D | Subida y errores generales documentados; progreso exacto por validar |
| S10 | Editor: páginas y capas | Selección de página y orden visual | R03 D; interacción I | Herramientas documentadas; bloqueo, agrupado y orden por validar |
| S11 | Editor: compartir | Acceso y copia de enlace | R08 D | Privado y opciones de permisos documentados; revocación por validar |
| S12 | Compartir → descargar | Formato, páginas y acción de descarga | R07 D | Opciones, avisos y descarga bloqueada documentados |
| S13 | Abrir enlace de lectura | Ver diseño publicado | R08 D; visor propio I | Lectura documentada; denegado y enlace inválido por validar |

Todos los estados responsivos quedan pendientes. Para la versión propia: editor prioritariamente de escritorio; visor de lectura adaptable a móvil.

## Flujos

Los clics siguientes son **estimaciones de acciones sobre controles**, derivadas de instrucciones; no medidas de Canva. No incluyen escritura, espera, gestos ni autenticación. No sumar los flujos como si fueran una sola tarea.

| ID | Objetivo y recorrido | Acciones estimadas | Casos que debe resolver la versión propia |
| --- | --- | --- | --- |
| F01 | Elegir plantilla: S03 → S04 → S05 → S06 | 3 desde proyectos, sin búsqueda | Sin resultados; recurso no disponible; crear documento independiente |
| F02 | Cambiar texto: S06 → S07 → S06 | 3: doble clic y salida; formato añade acciones | Desbordamiento; acentos; fuente no disponible; deshacer |
| F03 | Subir e insertar imagen: S06 → S09 → S06 | 4–5 incluido selector del sistema | Archivo inválido; cuota; fallo; no insertar hasta completar |
| F04 | Añadir elemento: S06 → S08 → S06 | 2 sin búsqueda | Sin resultados; recurso eliminado; inserción fuera de página |
| F05 | Gestionar páginas: S06 → S10 → S06 | 2–4, inferencia | Última página; duplicado independiente; orden conservado |
| F06 | Guardar y reabrir: S06 → S03 → S06 | 2 para volver y reabrir; guardado automático propuesto | Cierre durante guardado; almacenamiento lleno; versión incompatible |
| F07 | Descargar: S06 → S11 → S12 | 3 con formato predeterminado; más si se cambia | Subida pendiente; recurso premium en original; error de render; página inválida |
| F08 | Compartir lectura: S06 → S11 → S13 | 4–6 según selectores, más abrir enlace | Diseño privado; enlace revocado; contenido sensible en páginas ocultas |

F01: R02. F02: R04. F03: R06. F04: R05. F05: R03 e inferencia. F06: propuesta basada en persistencia necesaria, no medición del guardado original. F07: R07. F08: R08. En el original la documentación de compartir presenta diferencias entre comentarios y edición de invitados; no asumir un único requisito de autenticación para todos los permisos.

## Componentes para replica-design

Lista propuesta; ubicación funcional derivada de las fuentes, aspecto visual pendiente.

| Componente | Variantes / estados requeridos | Superficies |
| --- | --- | --- |
| Botón y botón de icono | Principal, secundario, peligro; foco, deshabilitado, espera | Todas |
| Navegación y pestañas | Activa, inactiva, foco por teclado | S01/S03/S04/S06–S10 |
| Buscador y filtros | Texto, limpiar, resultados, vacío | S03/S04/S08/S09 |
| Tarjeta de diseño / plantilla | Miniatura, título, selección, menú | S03–S05 |
| Diálogo y menú contextual | Abierto, cierre con Escape, foco restaurado | S02/S05/S11/S12 |
| Lienzo y caja de selección | Texto, imagen, forma; mover, escalar, girar | S06 |
| Barra de propiedades | Según selección; valores mixtos si multiselección | S07/S08 |
| Selector tipográfico y de color | Preajuste, valor personalizado, error | S07/S08 |
| Subidor de archivos | Arrastre, selección, progreso, reintento | S09 |
| Miniatura de página / lista de capas | Activa, orden, bloqueo propuesto | S10 |
| Indicador de guardado | Pendiente, guardando, guardado, fallo; diseño propio | S06 |
| Formulario de exportación | Formato, páginas, generando, completado, error | S12 |
| Control de enlace | Privado, lectura, copiar, revocar; diseño propio | S11/S13 |
| Aviso y confirmación | Error recuperable; eliminar página/documento | S03/S06/S09/S12 |

## Modelo de datos inferido

Esquema conceptual propio; no describe tablas ni campos internos de Canva. R11 confirma dominios públicos, pero no revela el motor de edición.

| Entidad | Campos propuestos | Relaciones, evidencia y confianza |
| --- | --- | --- |
| User | id, display_name | Propietario de diseños y recursos. R08/R11; media. Puede ser perfil local |
| Design | id, owner_id, title, schema_version, updated_at | Tiene páginas; R09/R11, alta para concepto, campos I |
| Page | id, design_id, position, width, height, background | Tiene elementos; R03/R07, alta para concepto |
| Element | id, page_id, type, x, y, width, height, rotation, z_index, props | Texto/imagen/forma; R03–R05, media; representación I |
| Asset | id, owner_id, storage_key, mime, width, height, license_note | Referenciado desde elementos; R06/R11, alta para concepto |
| Template | id, title, tags, document_snapshot, provenance | Crea copias de Design; R02, media; almacenamiento I |
| Revision | id, design_id, sequence, snapshot, created_at | Persistencia y recuperación; R03 menciona historial; campos I, media |
| ExportJob | id, design_id, revision_id, format, page_ids, status, output_key, error | Exporta revisión estable; R07/R11, media; trabajo asíncrono I |
| ShareLink | id, design_id, revision_id, token_hash, access, revoked_at | Lectura de una instantánea propuesta; R08, media; token y versión I |

Relaciones: User 1:N Design/Asset; Design 1:N Page/Revision/ExportJob/ShareLink; Page 1:N Element; Element N:1 Asset opcional. Template genera Design sin enlazar sus ediciones futuras. ShareLink apunta a una revisión publicada: elegir instantánea evita publicar cambios privados accidentalmente; es una decisión propuesta, no un comportamiento atribuido a Canva.

## Matriz y prioridades

Véase features.csv: 36 filas; 23 imprescindibles (must), 5 recomendables (should), 2 opcionales implementables (could) y 6 excluidas (skip). Las 6 exclusiones llevan prioridad could y clone=skip en el CSV; las otras 30 filas tienen clone=no. Las prioridades corresponden a uso propio. `original=yes` indica respaldo documental de la capacidad; `inferred` indica detalle pendiente. `clone=no` significa sin implementar. Las notas enlazan Rxx con esta tabla de fuentes.

Los planes públicos separan edición básica de herramientas avanzadas y contenido premium. No se reproducen precios, cuotas ni suscripciones: no son necesarios para uso personal. Las diferencias entre tablas y artículos de ayuda requieren comprobación antes de hacer una comparación comercial. [Fuente de planes](https://www.canva.com/pricing/).

## Exclusiones

No importar el catálogo de plantillas, fotos, fuentes, gráficos o marcas de Canva: usar creaciones propias o materiales con licencia compatible. Tampoco copiar código, textos de interfaz, logotipo, APIs privadas, acuerdos de terceros ni redes de usuarios. La funcionalidad de biblioteca se puede implementar con recursos propios.

Quedan fuera de esta primera versión: vídeo/audio, IA, edición simultánea, comentarios, impresión comercial, publicación social, marketplace, facturación y administración empresarial. No hacen falta para completar el flujo individual definido.

Las condiciones públicas restringen la replicación/ingeniería inversa del servicio, ciertos usos competitivos y la extracción automatizada. Se ha mantenido la investigación en documentación pública, sin acceder al editor con cuenta. Esta observación delimita la investigación; no constituye una conclusión jurídica sobre un futuro producto. [Condiciones, apartado de restricciones](https://www.canva.com/policies/terms-of-use/).

## Tamaño y dificultades

13 superficies lógicas, 8 flujos, 9 entidades conceptuales. **L** para una primera versión fiable con guardado, varios tipos de elemento, multipágina, exportación y enlaces de lectura: orden de un trimestre, sujeto al equipo, motor gráfico y validación. Un prototipo limitado sería menor; todo Canva sería **XL** y exigiría redefinir alcance. No se ha estimado equivalencia completa.

Tres dificultades principales:

1. Interacciones del lienzo y texto: selección, transformaciones, geometría, ajuste de líneas y deshacer coherente.
2. Exportación fiel: mismas fuentes, saltos, posiciones y resolución que en pantalla; recursos cargados antes de renderizar.
3. Persistencia y publicación: recuperar cambios tras un cierre y mantener diseños privados salvo publicación explícita.

## Validación pendiente y entrega a arquitectura

Comprobar posteriormente: una plantilla, una imagen propia, acentos y textos largos, tres páginas, cierre y reapertura, PNG/JPG/PDF y enlace revocado. Medir clics reales y registrar estados solo si se autoriza y resulta apropiado el acceso al servicio. Las pruebas del editor propio podrán verificar estos casos sin depender de una cuenta de Canva.

Para replica-architect: proponer motor de lienzo, formato de documento, guardado local con respaldo, exportación y alojamiento mínimo para lectura pública. Diseñar el primer recorrido completo: plantilla propia → edición → persistencia → PNG. Después añadir multipágina/PDF y compartir. Mantener identidad y recursos propios.
