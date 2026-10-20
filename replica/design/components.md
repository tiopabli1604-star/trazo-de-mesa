# Sistema de diseño de Trazo de Mesa

Sistema original de papel cálido y verde oscuro. No hay capturas del producto de referencia, por lo que estas medidas son decisiones propias, no valores observados. Fuentes del sistema: Arial/Segoe UI para controles y Georgia para títulos; no se redistribuyen fuentes. Tokens canónicos en la aplicación: src/app/tokens.css. Copia entregada: tokens.css y tokens.json. El mapeo Tailwind se entrega como referencia; no se introduce Tailwind en la aplicación.

Escala: 10/11/12/14/16/20/26/36 px; título 46 px. Espaciado base 4 px. Radios 7/12/16. Barra lateral 240, barra de herramientas 76, propiedades 282, cabecera 64 px. Escritorio 1440×900 y móvil 390×844. El editor móvil permite cerrar el panel y editar con controles DOM. Se prioriza la edición de escritorio.

| Componente | Variantes y estados | Accesibilidad | Pantallas |
| --- | --- | --- | --- |
| Button | primary, secondary, ghost, danger; hover, focus-visible, disabled; ocupado con texto | button real, nombre visible o aria-label; foco 2 px | Todas |
| Navegación | Inicio, colección, plantillas; activa/normal | nav etiquetada, botones accesibles | S01/S03/S04 |
| Tarjeta | Plantilla o diseño guardado; normal, hover y foco; vacío en galería | Botón de vista previa con nombre, SVG etiquetado | S03–S05 |
| Búsqueda | Con texto, limpia y sin resultados | Etiqueta accesible; resultados filtrados localmente | S04 |
| Modal | Abierto/cerrado, cierre por botón, Escape y fondo | dialog nativo, aria-label, foco modal y devolución de foco | S05/S11/S12 |
| Lienzo | Página vacía, objetos, selección, bloqueo, zoom | Descripción; propiedades y lista de capas como alternativa DOM | S06 |
| Propiedades | Texto/forma/imagen; una o varias selecciones | Inputs etiquetados y botones de duplicar/orden/borrar | S07/S08/S10 |
| Tipografía/color | Familias del sistema, tamaño, peso, color, fondo y alfa | label y controles nativos; geometría por teclado | S07/S08 |
| Subidas | Selector, arrastre, ocupado, archivo inválido | Botón y selector; aviso de error modal | S09 |
| Páginas/capas | Activa, selección, duplicación, última página no eliminable | Botones con nombres; checkboxes por capa | S10 |
| Guardado | Cargando, pendiente, guardando, guardado y fallo/conflicto | role=status; no afirmar guardado antes de commit | S06 |
| Exportación | PNG/JPG/PDF, selección de páginas, resolución, ocupado/error | Formato etiquetado y fieldset de páginas | S12 |
| Publicación | Preparando, activa, pendiente y revocada | Copiar/abrir/revocar; visor con texto alternativo por página | S11/S13 |
| Avisos | Confirmación y error recuperable | role=status o role=alert dentro de dialog | Todas |

Primitivas aisladas en /design. Evidencia visual en clone-screens/design-system.png. Los elementos del documento pueden tener colores elegidos por el usuario; el contraste de la interfaz usa los tokens. El comprobador incluye 15 pares de texto y controles; la prueba de contraste no certifica el contenido creado por el usuario. Se complementa con axe en las pantallas probadas.
