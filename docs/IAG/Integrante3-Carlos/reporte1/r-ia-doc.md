# Reporte de Uso Documental en el Proyecto

**Fecha:** 13/11/2026  
**Número de reporte:** 01  

---

# 1. Breve descripción de uso

Consultas realizadas mediante inteligencia artificial generativa para comprender cómo traducir el modelo entidad-relación/asociación de ChordLab (`USUARIO`, `PROYECTO`, `SECCION`, `PROGRESION`, `ACORDE` y `COMPARTIR_PROYECTO`) a un esquema relacional en MySQL, revisando el orden lógico de creación de tablas y los criterios para aplicar llaves foráneas y restricciones de integridad.

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
| 13/11/2026 | Gemini | [Consulta 1 – Estructura base y orden de creación de tablas](#consulta-1-estructura-base-y-orden-de-creacion-de-tablas) | [Respuesta 1 – Guía paso a paso del esquema SQL](#respuesta-1-guia-paso-a-paso-del-esquema-sql) |
| 13/11/2026 | Gemini | [Consulta 2 – Llaves foráneas, relaciones y restricciones](#consulta-2-llaves-foraneas-relaciones-y-restricciones) | [Respuesta 2 – Criterios para relaciones y restricciones](#respuesta-2-criterios-para-relaciones-y-restricciones) |

---

## Detalle de consultas y respuestas

### Consulta 1 – Estructura base y orden de creación de tablas
> Tengo este modelo entidad-asociación para ChordLab con las entidades USUARIO, PROYECTO, SECCION, PROGRESION, ACORDE y COMPARTIR_PROYECTO. Ayúdame a armar el script en MySQL paso a paso, indicándome qué orden seguir y qué considerar al definir cada tabla en lugar de soltarlo todo de golpe.

### Respuesta 1 – Guía paso a paso del esquema SQL
> Para llevar el modelo a MySQL de forma ordenada conviene dividirlo en pasos:
> 1. **Crear y seleccionar la base de datos** asegurando codificación UTF-8 (`utf8mb4`).
> 2. **Definir primero las tablas independientes o base** (como `USUARIO` y los catálogos/entidades principales sin dependencias externas inmediatas) con su `PRIMARY KEY` y tipos de datos adecuados.
> 3. **Continuar con las tablas dependientes** (`PROYECTO`, `SECCION`, `PROGRESION`, `ACORDE`) respetando la jerarquía del modelo para que las referencias existan al momento de crearlas.
> 4. **Cerrar con la tabla de relación/asociación** (`COMPARTIR_PROYECTO`) definiendo su llave compuesta o única según corresponda y los campos de control.
> A partir de este orden, revisamos la estructura de cada bloque antes de unirlo en `database/esquema.sql`.

### Consulta 2 – Llaves foráneas, relaciones y restricciones
> Ya voy armando las tablas en MySQL. ¿Qué criterios debo aplicar para definir las llaves foráneas, las reglas `ON DELETE` / `ON UPDATE` y las restricciones `NOT NULL` / `UNIQUE` entre `USUARIO`, `PROYECTO`, `SECCION`, `PROGRESION`, `ACORDE` y `COMPARTIR_PROYECTO`?

### Respuesta 2 – Criterios para relaciones y restricciones
> Al conectar las tablas en MySQL ten en cuenta:
> - **Integridad referencial:** cada `FOREIGN KEY` debe coincidir exactamente en tipo de dato y longitud con la columna referenciada.
> - **Reglas de cascada:** usa `ON DELETE CASCADE` cuando una entidad hija no tiene sentido sin su padre directo (por ejemplo, secciones o progresiones ligadas a un proyecto/sección) y `ON DELETE RESTRICT` o `SET NULL` donde convenga proteger registros.
> - **Restricciones de dominio:** marca con `NOT NULL` los campos obligatorios del modelo y usa `UNIQUE` para evitar duplicados (como correos/identificadores únicos o pares repetidos en `COMPARTIR_PROYECTO`).
> Con estos criterios puedes revisar y completar tu script antes de probarlo en el servidor MySQL.

---

## Observaciones adicionales

Las consultas se utilizaron como guía conceptual y de referencia para estructurar correctamente las dependencias y restricciones del esquema relacional antes de consolidar la versión final del script.