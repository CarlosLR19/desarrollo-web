# Reporte de IA Desarrollo en el Proyecto

**Fecha:** 13/11/2026  
**Número de reporte:** 02  
**Integrante:** Nino Alessandro Navarro Lam  
**Entregable:** 2 – Backend básico

---

# 1. Breve descripción de uso

Se utilizaron herramientas de inteligencia artificial como apoyo durante la configuración y desarrollo del backend de ChordLab.

Las consultas se enfocaron en dos aspectos. El primero fue solucionar problemas de compatibilidad entre Java 21 y Java 17 en WSL, revisando la configuración del JDK y su relación con Spring Boot 4. El segundo fue comprender y diseñar correctamente la lógica musical del sistema, incluyendo la generación de acordes mayores, menores y de séptima, inversiones, escalas y progresiones armónicas.

Las respuestas permitieron identificar los ajustes necesarios para el entorno de desarrollo y definir los fundamentos técnicos para implementar el motor musical mediante Java, relacionándolo posteriormente con la API REST y Tone.js.

---

# 2. Evidencias de uso

| Evidencia | Formato |
|---|---|
| **Herramienta** | ChatGPT (OpenAI) y Claude / Claude Pro (Anthropic). |
| **Modelo/temperatura** | No se registró el identificador exacto de los modelos ni la temperatura utilizada. |
| **Prompt original** | [Consulta 1 – Configuración de Java 17](#consulta-1-configuracion-de-java-17). <br><br> [Consulta 2 – Implementación de la lógica musical](#consulta-2-implementacion-de-la-logica-musical). |
| **Respuesta de IA** | [Respuesta 1 – Configuración de Java 17](#respuesta-1-configuracion-de-java-17). <br><br> [Respuesta 2 – Implementación musical](#respuesta-2-implementacion-musical). |
| **Código anterior** | No se identificó un commit específico asociado exclusivamente a estas dos consultas. |
| **Código posterior** | No se identificó un commit específico que permita aislar los cambios derivados de estas consultas. |
| **Diferencias entre versiones** | No se dispone de una salida `git diff --numstat` correspondiente exclusivamente a estas consultas. |
| **Prueba de funcionamiento** | Para Java se