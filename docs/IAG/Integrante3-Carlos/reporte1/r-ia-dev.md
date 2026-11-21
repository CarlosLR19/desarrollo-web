# Reporte de IA Desarrollo en el Proyecto

**Fecha:** 13/11/2026  
**Número de reporte:** 01  

---

# 1. Breve descripción de uso

Apoyo mediante inteligencia artificial generativa para estructurar y redactar el script SQL de la base de datos de ChordLab (`database/esquema.sql`) en MySQL a partir del modelo entidad-relación/asociación (que contempla `USUARIO`, `PROYECTO`, `SECCION`, `PROGRESION`, `ACORDE` y `COMPARTIR_PROYECTO`), avanzando de forma ordenada por etapas de diseño, definición de tablas y validación de integridad.

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
| **Herramienta** | Gemini |
| **Modelo/temperatura** | No se registró el identificador exacto del modelo ni la temperatura utilizada |
| **Prompt original** | [Consulta 1 – Estructura base y orden de creación de tablas](#consulta-1-estructura-base-y-orden-de-creacion-de-tablas) / [Consulta 2 – Llaves foráneas, relaciones y restricciones](#consulta-2-llaves-foraneas-relaciones-y-restricciones) |
| **Respuesta de IA** | [Respuesta 1 – Guía paso a paso del esquema SQL](#respuesta-1-guia-paso-a-paso-del-esquema-sql) / [Respuesta 2 – Criterios para relaciones y restricciones](#respuesta-2-criterios-para-relaciones-y-restricciones) |
| **Código anterior** | Commit ([No aplica]) |
| **Código posterior** | Commit ([No aplcia]) |
| **Prueba de funcionamiento** | Ejecución de `database/esquema.sql` en MySQL verificando la creación de la base de datos y las tablas sin errores de sintaxis; captura/salida de consola adjunta en evidencia |
| **Código de uso** | Generación / Diseño / Modificación / Revisión |
| **Reflexión del estudiante** | Utilizar la IA como guía paso a paso me ayudó a entender cómo llevar un modelo entidad-asociación a un script SQL real sin saltarme dependencias, definiendo primero las entidades base y luego las tablas hijas y de relación. Aprendí a estructurar una base de datos de mejor manera, revisando tipos de datos, llaves primarias y foráneas, y comportamientos ante borrado o actualización—para luego verificar y ajustar el script directamente en MySQL y controlarlo con Git. |

