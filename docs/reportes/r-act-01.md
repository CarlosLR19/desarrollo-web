# Reporte de actividades 01 – Diseño inicial de ChordLab

**Periodo:** Día 1 y Día 2  
**Proyecto:** ChordLab  
**Repositorio:** desarrollo-web  
**Integrantes:** Nino Alessandro Navarro Lam, Carlos Vicente López Rosales y César Rodrigo Díaz Hernández.

## 1. Actividades realizadas

Durante los primeros dos días de trabajo se definió la propuesta de ChordLab, una plataforma web orientada a facilitar la composición musical mediante la generación de acordes, progresiones armónicas y herramientas de reproducción de audio.

Se realizaron las siguientes actividades:

- Definición de la idea general y descripción del proyecto.
- Identificación de la problemática que busca resolver la plataforma.
- Elaboración de la justificación y los objetivos.
- Definición de los requerimientos funcionales y no funcionales.
- Diseño del modelo entidad-relación de la base de datos.
- Identificación de las entidades, atributos, claves primarias y claves foráneas.
- Diseño inicial de los endpoints de la API REST.
- Definición de la arquitectura de tres capas.
- Selección de las tecnologías que se utilizarán durante el desarrollo.
- Distribución de responsabilidades entre los tres integrantes.
- Creación y organización inicial del repositorio de GitHub.
- Elaboración del README inicial y documentación del uso de inteligencia artificial.

## 2. Documentación elaborada

Como resultado de las actividades se desarrollaron los siguientes documentos:

**01. Propuesta del proyecto:** contiene la descripción de ChordLab, la problemática, justificación y objetivos.

**02. Requisitos del sistema:** establece los requerimientos funcionales y no funcionales que deberá cumplir la plataforma.

**03. Modelo entidad-relación:** representa la estructura inicial de la base de datos y las relaciones entre sus entidades.

**04. Diseño de API REST:** define los endpoints, métodos HTTP, ejemplos de solicitudes, respuestas y mecanismos de comunicación entre frontend y backend.

**05. Arquitectura del sistema:** describe la arquitectura de tres capas, sus componentes y las tecnologías propuestas.

**06. Responsabilidades del equipo:** establece las actividades asignadas a cada integrante.

**07. Uso de inteligencia artificial:** documenta las herramientas contempladas y los criterios para registrar su utilización durante el proyecto.

También se elaboró el README inicial para presentar el proyecto y describir la organización del repositorio.

## 3. Participación de los integrantes

**César Rodrigo Díaz Hernández – Análisis y desarrollo frontend**

Participó en la definición de los requerimientos del sistema, la descripción de la problemática, los objetivos y la propuesta general del proyecto. Su responsabilidad principal será el diseño y desarrollo de las interfaces, así como la integración del frontend con los servicios del backend.

**Nino Alessandro Navarro Lam – Backend y lógica musical**

Participó en la definición inicial de los servicios de la API REST y la organización de las funcionalidades del servidor. Su responsabilidad principal será desarrollar el backend con Java y Spring Boot, implementar los servicios y desarrollar la lógica para generar acordes y progresiones armónicas.

**Carlos Vicente López Rosales – Base de datos e integración**

Participó en el diseño inicial del modelo entidad-relación y en la definición de las estructuras de almacenamiento. Su responsabilidad principal será configurar MySQL, implementar las relaciones mediante JPA e Hibernate y apoyar la integración de los componentes musicales.

Los tres integrantes participaron en la definición general del proyecto y en la organización inicial del trabajo.

## 4. Evidencias de trabajo

Para documentar los avances de esta etapa se consideran las siguientes evidencias:

- Captura del repositorio de GitHub con la estructura inicial del proyecto.
- Captura de los documentos de diseño almacenados en el repositorio.
- Imagen del diagrama entidad-relación con sus entidades y relaciones.
- Captura del diseño de los endpoints de la API REST.
- Captura del diagrama de arquitectura de tres capas.
- Evidencias de los commits realizados por los integrantes.

Las capturas correspondientes se incorporarán a la carpeta de evidencias del proyecto.

## 5. Problemas encontrados

Durante la elaboración del modelo entidad-relación se identificó que la importación de tablas mediante SQL en Draw.io no generaba automáticamente las conexiones entre las entidades. Por este motivo, fue necesario revisar las relaciones y configurar sus cardinalidades mediante los conectores correspondientes.

También se revisó la organización de los documentos para mantener una estructura coherente con los requisitos establecidos para el proyecto.

## 6. Avance funcional

Al finalizar los primeros dos días, ChordLab cuenta con una propuesta definida, requerimientos documentados, un modelo inicial de datos, el diseño de la API REST y una arquitectura de tres capas.

El proyecto se encuentra en la etapa de análisis y diseño. Todavía no se han implementado las funcionalidades del frontend ni del backend, por lo que las actividades realizadas corresponden principalmente a la planificación y documentación técnica.

## 7. Uso de inteligencia artificial generativa

Durante esta etapa se utilizó ChatGPT como herramienta de apoyo para explicar conceptos técnicos, organizar la documentación, revisar la estructura de los requerimientos, diseñar ejemplos de endpoints y desarrollar propuestas para la arquitectura del sistema.

También se contempla utilizar Claude y Claude Pro durante las siguientes etapas para apoyar el análisis, la revisión de código y la resolución de problemas técnicos.

Las consultas relevantes y los resultados utilizados serán registrados individualmente por cada integrante, siguiendo los criterios establecidos en el documento de uso de inteligencia artificial.

## 8. Próximas actividades

Para la siguiente etapa se contempla:

- Configurar el entorno de desarrollo mediante WSL con Ubuntu.
- Preparar el proyecto de Spring Boot.
- Configurar la conexión entre Java y MySQL.
- Crear la estructura inicial del backend.
- Preparar las primeras entidades y repositorios.
- Comenzar el desarrollo de los servicios iniciales de la API REST.
- Realizar las primeras pruebas mediante CURL.

## 9. Resultado de la etapa

Se concluyó la etapa inicial de análisis y diseño de ChordLab, estableciendo las bases para comenzar la implementación del sistema.

El equipo cuenta con una propuesta definida, una distribución de responsabilidades y documentación técnica que servirá como referencia durante las siguientes etapas del desarrollo.