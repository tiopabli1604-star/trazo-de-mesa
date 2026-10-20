# Entrepreneur: investigación y mejoras para uso propio

Muestra exploratoria: **12 fragmentos de 12 aportaciones en 3 plataformas**: Reddit (8), App Store (2), Trustpilot (2). Fechas no visibles se dejaron vacías; solo 2 valoraciones numéricas estaban identificadas. Es una muestra deliberada, pequeña y sesgada por búsqueda, con opiniones antiguas; no representa a toda la base de usuarios. La meta de 100 reseñas no se alcanzó ni se presenta como alcanzada. reviews.csv conserva extractos literales y enlaces. feedback.md contiene la clasificación automática; la lectura manual siguiente corrige los límites de esa clasificación.

## Lo que molesta, falta y queda por resolver

| Lista | Observación manual en esta muestra | Recuento / fuentes | Evidencia |
| --- | --- | --- | --- |
| Molesta | Pérdida aparente, sobrescritura o dificultad para localizar versiones | 5 aportaciones, 1 plataforma: Reddit; evidencia débil | [Versiones](https://www.reddit.com/r/canva/comments/1ds8wah), [sobrescritura](https://www.reddit.com/r/canva/comments/1p26baz/warning_new_bug_might_overwritedelete_your_design/), [proyectos](https://www.reddit.com/r/canva/comments/1uzshn0/i_lost_years_of_work/), [lista reciente](https://www.reddit.com/r/canva/comments/1p33c9j/anyone_elses_projects_disappearing/), [acceso](https://www.reddit.com/r/canva/comments/q9p7ai/everything_is_gone/) |
| Molesta | Bloqueos o una acción de deshacer que falla | 2 aportaciones, 2 plataformas; evidencia débil | App Store y Reddit en reviews.csv |
| Molesta | Soporte insatisfactorio | 1 aportación, Trustpilot; evidencia débil; la muestra contiene también una valoración favorable de facilidad | Trustpilot en reviews.csv |
| Falta | Una acción más clara para conservar otra versión | 1 aportación, Reddit; la propia conversación explica que existe hacer una copia | [Petición y respuestas](https://www.reddit.com/r/canva/comments/1ds8wah) |
| Falta | Acceso más directo a proyectos personales | 1 aportación, App Store; fragmento corto, leer contexto antes de generalizar | [Features are fine but design priorities is not](https://apps.apple.com/pl/app/canva-ai-video-photo-editor/id897446215?see-all=reviews) |
| Sin resolver para ese autor | Continuar ante desconexiones | 1 aportación antigua, Reddit; no es evidencia de una carencia actual | [Desconexiones](https://www.reddit.com/r/canva/comments/1d2xg7g/canva_disconnected/) |

No se afirma que Canva carezca de historial, duplicación ni edición offline. El propio recon documenta cambios recientes y la página de precios anuncia funciones offline. Tampoco se reproducen como hechos los fallos que describen autores: son experiencias reportadas, sin reproducción independiente. La investigación no justifica montar una empresa de soporte ni construir una suite entera.

## Plan de mejoras

| Mejora | Tamaño | Evidencia / motivación | Fase y resultado |
| --- | --- | --- | --- |
| Copia independiente visible en colección | S | Petición de versiones, una aportación | build; implementada y comprobada |
| Respaldo editable que incluya imágenes | M | Cinco reportes sobre pérdida/ubicación; criterio propio de control | backend/build; implementado con importación |
| Guardado confirmado solo tras escritura | M | Reportes de persistencia; requisito técnico propio | build/test; implementado con protección de revisión |
| Acceso directo a Mis diseños | S | Una aportación sobre navegación | design/build; implementado |
| Revocación separada del borrado local | M | Decisión de privacidad propia; no atribuida a reseñas | backend/test; implementado |

Estos cinco elementos se añaden a features.csv como mejoras propias (original=no), sin aumentar la puntuación de paridad. No se trasladan quejas de facturación a un modelo comercial: esta edición personal no cobra.

## Tres ángulos posibles

1. **Tu estudio local, con respaldo que puedes llevarte.** Apoyado de forma débil por los cinco reportes de versiones/ubicación y por el requisito explícito de uso propio. Recomendado como descripción verificable del producto; no como promesa de que nunca se perderán datos.
2. **Tus proyectos, a un paso.** Una aportación de App Store; evidencia débil. Se materializa en una colección accesible, sin afirmar superioridad universal.
3. **Un editor pequeño para terminar una pieza.** Responde al alcance individual confirmado y a una petición genérica de funciones básicas; evidencia de mercado insuficiente. No se anuncia como hallazgo validado.

No se han enviado mensajes, pedido reseñas ni contactado a los autores. Sus palabras no se usan como testimonios ni en la presentación del producto.
