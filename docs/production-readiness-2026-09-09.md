# Validación de producción — Dejabooom

> Evaluación histórica previa a la remediación. El estado vigente está en
> `docs/release-progress-2026-09-12.md`.

Revisión del 9 de septiembre de 2026 (America/Mexico_City). **Dictamen: no lanzar todavía a clientes de pago.** La base del MVP está implementada y compila, pero quedan defectos de cobro/entrega, alertas de seguridad y validación operativa pendiente.

## Dónde nos quedamos

- Último commit: `64baaead7a918207ddeb457f8ab16518d5e6ed20`, del 31 de julio de 2026, en `feature/ai-recommendation-mvp`. El árbol de trabajo estaba limpio al comenzar y el código de aplicación no se modificó durante esta revisión.
- [PR #1: Add paid AI recommendation MVP with durable processing](https://github.com/edisra10/dejabooom/pull/1) sigue abierto y en borrador. Su base `main` permanece en `7f993e0fe0efac0097b23fe271ea3015eafafef3`.
- Se implementaron cuestionario persistente, selección de destinos, Stripe Checkout, generación con IA, enlaces privados, correos, administración, cola persistente y límites de solicitudes compartidos.
- [CI del candidato](https://github.com/edisra10/dejabooom/actions/runs/30665377752) y [despliegue de preview](https://vercel.com/edsons-projects-8bd837cb/dejabooom/682QwNS8xuyzTZCLdssHWqxMUHYV) figuran exitosos. La descripción del PR identifica como pendiente configurar staging y verificar todo el recorrido de pago de prueba a reveal.

## Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| ESLint y TypeScript locales | Sin errores; además se completaron dentro del build. |
| Vitest | 7 archivos, 23 pruebas aprobadas. |
| Prisma validate | Esquema válido. No equivale a migraciones aplicadas. |
| Build de producción local | Aprobado, código de salida 0. El primer intento encontró `spawn EPERM` en el sandbox; fuera del sandbox terminó correctamente. |
| CI remoto del mismo SHA | Instalación, audit, lint, tipos, pruebas y build aprobados en la ejecución histórica de julio. |
| Consulta de seguridad actual | 250 nombres de paquetes del lockfile sin marca `dev`, consultados al endpoint oficial npm de avisos. 11 avisos coincidentes: 2 críticos, 8 altos y 1 moderado, en 7 paquetes. No son 11 fallos independientes de la aplicación; algunos avisos se solapan o dependen del entorno. |
| Reproducciones aisladas | Un HTTP 403 simulado de Resend se trata como envío resuelto; el helper rechaza el evento de pago diferido exitoso; un perfil válido de 30 días tiene cero destinos elegibles en el catálogo semilla. |
| Pago completo → generación → correo → reveal | No validado contra proveedores y base de datos de staging. |

Se usó Node 24.19.0 y los binarios ya instalados de las herramientas. No se volvió a ejecutar `npm ci`; npm no estaba en PATH. La consulta de seguridad se hizo contra el endpoint oficial de avisos con las versiones del lockfile y comprobación de sus rangos, no mediante `npm run audit:prod`. La instalación reproducible con Node/npm declarados en el proyecto deberá repetirse al cerrar los cambios.

## Bloqueos que deben cerrarse

| Prioridad | Hallazgo y consecuencia | Evidencia | Condición para cerrar |
| --- | --- | --- | --- |
| Alta | Next.js 15.5.22 y el override de Sharp 0.35.3 coinciden con avisos recientes. El audit histórico ya no acredita seguridad actual. | `package.json:31`, `package.json:44`; fuentes abajo. | Actualizar a versiones corregidas compatibles, actualizar lockfile y repetir audit/CI. No basta actualizar Next si el override conserva Sharp vulnerable. |
| Alta | Se puede iniciar un cobro aunque no exista destino viable. Un perfil válido de 30 días produce 0 candidatos entre los 32 destinos del seed; la imposibilidad se descubre después del pago. | `src/app/api/trip-profiles/route.ts:56`; `src/app/api/checkout/sessions/route.ts:54`; `src/server/recommendations/scoring-engine.ts:145`; `src/server/recommendations/generate-recommendation.ts:57`. | Comprobar elegibilidad antes de permitir Checkout y ofrecer una salida recuperable. Probar presupuesto, duración y restricciones sin candidatos. |
| Alta | El envío de correo ignora el objeto de error de Resend. Un rechazo del proveedor puede dejar recomendación `GENERATED` y trabajo `COMPLETED`, sin entrega ni reintento. La configuración ausente también omite el correo sin fallar al llamador. | `src/server/email/email-service.ts:36`, `:46`; `src/server/recommendations/generate-recommendation.ts:163`; `src/server/recommendations/recommendation-jobs.ts:97`. | Manejar errores del proveedor y persistir/reintentar la entrega sin perder un pedido pagado. Probar remitente rechazado, caída del proveedor y recuperación. |
| Alta si se habilitan métodos diferidos | Falta `checkout.session.async_payment_succeeded`. El pago puede completarse después sin que el pedido pase a pagado ni se genere la recomendación. Checkout deja la selección de métodos a la configuración de Stripe. | `src/server/payments/webhook-events.ts:3`; `src/app/api/webhooks/stripe/route.ts:56`, `:172`; `src/app/api/checkout/sessions/route.ts:73`. | Procesar el evento con idempotencia o restringir explícitamente los métodos aceptados. Verificar la configuración real. |
| Alta | Concierge promete revisión humana pero usa la entrega automática del plan AI. La elección de tres finalistas tampoco tiene interfaz para comparar/elegir. | `src/server/checkout/service-products.ts:43`; `src/server/recommendations/generate-recommendation.ts:35`, `:173`; `src/features/trip-profile/constants/options.ts:140`; `src/app/reveal/[token]/page.tsx:162`. | Implementar lo prometido o retirar esas opciones del alcance inicial. |
| Alta | El formulario admite 2–30 días y el esquema de itinerario exige 3–5 entradas diarias. La duración del entregable no está alineada con la solicitud. | `src/features/trip-profile/schemas/trip-profile-schema.ts:45`; `src/server/recommendations/generated-itinerary-schema.ts:16`. | Alinear duración ofertada, elegibilidad y contenido entregado; explicitar cualquier itinerario parcial. |
| Alta | Las políticas públicas siguen siendo borradores. Reembolsos dice que sus condiciones deben definirse antes del lanzamiento. | `src/app/legal/legal-page.tsx:18`; `src/app/legal/refunds/page.tsx:14`. | Definir y aprobar los textos comerciales aplicables y publicarlos junto con un canal real de soporte. Esta revisión constata texto pendiente; no constituye validación jurídica. |

Además, la pantalla de éxito indica procesamiento incluso cuando la recomendación ha fallado (`src/app/checkout/success/page.tsx:50`); los enlaces inválidos remiten a soporte sin ofrecer un contacto (`src/app/reveal/[token]/page.tsx:68`); errores del POST nativo de Checkout pueden mostrar JSON crudo. Deben existir estados claros de error y recuperación para los primeros clientes.

## Seguridad: alcance de las alertas

Los mantenedores sitúan los parches de Next.js en **15.5.24** para la rama 15 y los de Sharp en **0.35.4**. La alerta de Next sobre imágenes depende de optimizar AVIF; la otra es específica de servidores Windows y no prueba que Vercel esté expuesto. No se intentó explotar ninguna vulnerabilidad. Fuentes primarias: [Next.js, procesamiento AVIF](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), [Next.js, servidores Windows](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36). El [aviso de Sharp](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) confirma que 0.35.3 es anterior al parche.

La consulta también devolvió avisos para `deepmerge-ts 7.1.5`, `fast-uri 3.1.5`, `mysql2 3.15.3` y `nanoid 3.3.16`. Parte llega a través de Prisma/configuración y PostCSS: estar en el árbol consultado no demuestra accesibilidad desde una solicitud pública. Corresponde actualizar y evaluar esas rutas antes de dar por cerrado el audit.

El comportamiento esperado de los proveedores se contrastó con [Resend: manejo de errores](https://resend.com/docs/send-with-express/) y [Stripe: cumplimiento de Checkout y pagos diferidos](https://docs.stripe.com/checkout/fulfillment).

## Despliegue y evidencia que falta

- El [alias público observado](https://dejabooom.vercel.app) respondió 200, pero sirve la landing anterior: título `Create Next App`, destinos ficticios A–D, precios de ejemplo y datos de contacto de ejemplo. `/surprise-trip` respondió 200; las cuatro rutas legales, `/admin` y `/api/webhooks/stripe` respondieron 404. Este alias no demuestra cuál es el dominio de producción configurado en el panel privado.
- `dejabooom.com` y `www.dejabooom.com` no resolvieron desde el entorno de comprobación. Debe confirmarse el dominio de lanzamiento y su DNS.
- El preview redirige al login de Vercel para acceso anónimo. El navegador alcanzó la URL del panel del proyecto, pero no pudo leer su contenido por timeout. No se acreditó la configuración privada.
- No se verificaron variables remotas, credenciales live/test, migraciones y seed aplicados, remitente verificado, alertas al operador ni scheduler activo. La falta de variables de aplicación en `.env.local` no demuestra que falten en Vercel.
- El repositorio no contiene `vercel.json`; el build sólo ejecuta `next build`. README exige migración y programación del worker por separado. Un scheduler externo podría existir; hace falta evidencia de su ejecución y recuperación de trabajos.

## Orden recomendado para autorizar el lanzamiento

1. Actualizar dependencias y corregir elegibilidad antes del cobro, entrega por correo y comportamiento de pagos diferidos.
2. Definir un alcance vendible consistente: AI/Concierge, finalistas y duración. Cerrar políticas y soporte.
3. Configurar y verificar staging con DB, migraciones, catálogo, Stripe de prueba, IA, correo y scheduler.
4. Probar el recorrido completo y sus fallos: pago exitoso, evento repetido, pago fallido/diferido, cero destinos, generación interrumpida, correo rechazado y recuperación del enlace. Registrar pedido, resultado y evidencia sin secretos.
5. Repetir instalación/CI/audit sobre el commit final, verificar dominio y configuración de producción, y sólo entonces aprobar merge y despliegue.

No se hicieron cargos, envíos de correo, escrituras de base de datos remota, merge ni despliegue durante esta revisión.
