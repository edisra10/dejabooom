# Estado de lanzamiento — Dejabooom

Revisión del 12 de septiembre de 2026 (America/Mexico_City). **Dictamen actual: el candidato está listo para desplegar y validar en staging; todavía no está autorizado para recibir pagos reales en producción.**

## Trabajo completado

- Se actualizaron Next.js, Sharp, Prisma y NanoID a versiones corregidas y se regeneró el lockfile con la versión de npm declarada por el proyecto.
- El alcance comercial del lanzamiento quedó limitado al viaje sorpresa generado con IA. Se retiraron del checkout Concierge y la selección de tres finalistas hasta que exista una implementación real.
- El cuestionario, la elegibilidad y el itinerario ahora comparten una duración de dos a cinco días. El esquema generado exige exactamente el número solicitado.
- Se comprueba que exista un destino elegible antes de permitir el pago y nuevamente al crear Checkout. Un perfil sin coincidencias recibe una salida recuperable sin iniciar un cobro.
- Los rechazos de Resend ya producen error y reintento. La recomendación sólo pasa a `GENERATED` después de que el proveedor acepta el correo; los reintentos reutilizan el reveal cifrado sin volver a generar el itinerario.
- Stripe procesa `checkout.session.async_payment_succeeded` de forma idempotente y espera ese evento cuando `checkout.session.completed` todavía no está pagado.
- Checkout, confirmación, enlaces inválidos y fallos de generación muestran estados recuperables y un contacto de soporte.
- Se publicaron textos operativos de Términos, Privacidad, Reembolsos y descargo de IA/viajes. Aún requieren aprobación de la persona responsable del negocio y, si corresponde, revisión jurídica.
- Se agregó `scripts/validate-release-env.mjs` y el runbook de staging/producción para validar configuración sin imprimir secretos.

## Evidencia local

| Control | Resultado |
| --- | --- |
| Instalación reproducible | `npm ci` completado con npm 11.6.2 y Prisma Client generado. |
| ESLint | Aprobado. |
| TypeScript | Aprobado con `tsc --noEmit`. |
| Vitest | 9 archivos y 29 pruebas aprobadas. |
| Build de producción | Aprobado con Next.js 15.5.25; 18 rutas generadas o preparadas. |
| Audit del runtime desplegado | Sin alertas altas o críticas fuera de las excepciones exactas y documentadas del tooling de Prisma. Las dependencias opcionales, incluido Sharp, permanecen dentro del audit. |
| Validador de entorno | Funciona y enumera las variables faltantes sin revelar valores; el entorno local no contiene las credenciales de staging. |
| Proyecto Vercel | Vínculo confirmado con `edsons-projects-8bd837cb/dejabooom`. El inventario remoto devolvió cero variables de entorno. Los dos previews más recientes, de hace 43 días, están `Ready`; el último despliegue `Production` exitoso tiene 352 días. |

El audit conserva cuatro entradas altas en paquetes opcionales/de herramientas de Prisma (`@prisma/config`, `deepmerge-ts`, `fast-uri` y `mysql2`). La aplicación usa PostgreSQL y esas rutas no forman parte de las solicitudes del runtime desplegado. El control permite únicamente los identificadores actuales de esos avisos; una alerta nueva, incluso en esos paquetes, hará fallar CI. No se aplicó un override incompatible a Prisma. Debe conservarse esta excepción documentada hasta que Prisma publique un árbol corregido compatible.

## Puertas externas pendientes

1. Configurar el proyecto Vercel para staging con PostgreSQL, migraciones, catálogo, Stripe test, OpenAI, Resend, remitente verificado, soporte y scheduler. Actualmente no contiene variables remotas.
2. Ejecutar todos los escenarios del `docs/release-runbook.md` y conservar evidencia de pedidos, eventos, trabajos y entregas sin copiar secretos.
3. Aprobar los textos legales/comerciales y confirmar que el buzón de soporte está monitoreado.
4. Confirmar el dominio de producción, DNS, protección de despliegue, webhook y scheduler sobre el mismo origen.
5. Repetir instalación, audit, pruebas y build sobre el SHA final; después hacer un único pago real controlado y verificar el reembolso.

Hasta cerrar esas cinco puertas no debe promoverse el alias público ni habilitarse tráfico de clientes de pago.
