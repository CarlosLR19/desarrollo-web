# Registro de uso de inteligencia artificial – Consultas de dudas

**Proyecto:** ChordLab  
**Integrante:** Nino Alessandro Navarro Lam  
**Fecha:** 13/11/2026  
**Tipo de registro:** Consultas técnicas, explicaciones y resolución de dudas.

---

## Consulta 1. Configuración de Java 17 en WSL

**Herramienta utilizada:** ChatGPT

**Pregunta realizada:**

¿Cómo cambio Java 21 a Java 17? En WSL solamente tengo instalado JDK 17 y con Java 21 no compilaba. ¿Spring Boot 4 funciona con Java 17?

**Respuesta obtenida:**

Spring Boot 4 es compatible con Java 17, ya que esta versión es el requisito mínimo para ejecutar el framework. Por lo tanto, es posible desarrollar el proyecto ChordLab utilizando JDK 17.

Para realizar el cambio se deben seguir estos pasos:

1. Verificar las versiones instaladas mediante los comandos `java -version`, `javac -version` y `mvn -version`.
2. Utilizar `sudo update-alternatives --config java` para seleccionar Java 17 como versión predeterminada.
3. Realizar el mismo procedimiento con `javac` para seleccionar el compilador correspondiente.
4. Configurar la variable de entorno `JAVA_HOME` para que apunte a la instalación del JDK 17.
5. Modificar el archivo `pom.xml` y establecer `<java.version>17</java.version>`.
6. Ejecutar `mvn clean compile` o `./mvnw clean compile` para comprobar que el proyecto compile correctamente.

**Aplicación en el proyecto:**

La consulta permitió identificar cómo configurar el entorno de desarrollo de WSL para utilizar una versión de Java compatible con el JDK disponible. Se decidió utilizar Java 17 para mantener una configuración uniforme entre el entorno de desarrollo y Spring Boot.

---

## Consulta 2. Explicación detallada de los componentes desarrollados

**Herramienta utilizada:** Claude (Anthropic) / Claude Pro

**Pregunta realizada:**

Explícame más a detalle la parte que hicimos nosotros.

**Respuesta obtenida:**

Claude explicó la organización y el funcionamiento de los componentes desarrollados para ChordLab, revisando principalmente tres áreas:

**1. Proyecto Spring Boot**

Se explicó cómo se genera el proyecto mediante Spring Initializr y la función de sus archivos principales:

- `pom.xml`: administra las dependencias y configuraciones de Maven.
- `mvnw`: permite utilizar una versión específica de Maven sin depender de una instalación global.
- `ChordlabApplication.java`: contiene el punto de entrada que inicia la aplicación Spring Boot.
- `application.properties`: configura la conexión con MySQL, el puerto del servidor y las propiedades de Hibernate.
- `ChordlabApplicationTests.java`: permite comprobar que el contexto de Spring pueda iniciar correctamente.

También se explicó la función de las dependencias utilizadas, como Spring Web, Spring Data JPA, el conector de MySQL y las herramientas de validación.

**2. Estructura de la base de datos**

Se explicó cómo se organizan las tablas de ChordLab y cómo se relacionan mediante claves primarias y foráneas.

Se revisaron las tablas de usuarios, proyectos, secciones, progresiones, acordes y proyectos compartidos.

También se explicó el funcionamiento de las relaciones con `ON DELETE CASCADE`, los campos de ordenamiento, la duración de los acordes mediante `DECIMAL` y el atributo de inversión.

**3. Integración entre backend y base de datos**

Se explicó cómo las entidades de Java representan las tablas de MySQL mediante JPA e Hibernate.

También se revisó la relación entre los controladores, servicios, repositorios y entidades, así como la manera en que las solicitudes HTTP llegan al backend y se procesan antes de consultar o modificar la información almacenada.

**Aplicación en el proyecto:**

La explicación permitió comprender mejor la estructura interna del sistema, la función de cada archivo y la comunicación entre los componentes. Esto facilitó la identificación de responsabilidades y la comprensión del funcionamiento general del backend.

---

## Consulta 3. Explicación de la lógica musical

**Herramienta utilizada:** Claude (Anthropic) / Claude Pro

**Pregunta realizada:**

Explícame lo de la parte musical.

**Respuesta obtenida:**

Claude explicó los fundamentos de teoría musical necesarios para comprender la implementación de la clase `TeoriaMusicalService.java`.

Se revisaron los siguientes conceptos:

**1. Notas musicales e intervalos**

Se explicó que la música occidental utiliza doce sonidos diferentes por octava y que los intervalos representan la distancia entre dos notas.

Se distinguieron los semitonos y los pasos entre letras musicales, ya que ambos son necesarios para calcular correctamente los nombres de las notas.

**2. Tipos de acordes**

Se explicó cómo se construyen los acordes a partir de una nota fundamental y diferentes intervalos:

- Mayor: fundamental, tercera mayor y quinta justa.
- Menor: fundamental, tercera menor y quinta justa.
- Disminuido: fundamental, tercera menor y quinta disminuida.
- Aumentado: fundamental, tercera mayor y quinta aumentada.
- Séptima dominante: acorde mayor con séptima menor.
- Mayor séptima: acorde mayor con séptima mayor.
- Menor séptima: acorde menor con séptima menor.

**3. Representación de las notas en el código**

Se explicó la importancia de representar cada nota mediante su letra y alteración, en lugar de utilizar únicamente un número de semitonos.

Esto permite conservar la escritura musical correcta. Por ejemplo, la séptima menor de F se representa como Eb y no como D#, aunque ambas notas tengan la misma altura sonora.

**4. Generación de acordes e inversiones**

Se explicó cómo el algoritmo utiliza una tabla de tipos de acordes y sus fórmulas de intervalos para calcular las notas correspondientes.

También se revisó cómo funcionan las inversiones, modificando el orden de las notas y elevando una octava las notas que pasan a ocupar una posición superior.

**5. Escalas y progresiones armónicas**

Se explicó cómo construir escalas mayores y menores mediante patrones de intervalos y cómo utilizar sus grados para generar progresiones armónicas.

Se revisaron ejemplos de progresiones para estilos pop, clásico, jazz y blues, además de la utilización de reglas de armonía funcional para generar secuencias musicales.

**Aplicación en el proyecto:**

La consulta permitió comprender los fundamentos musicales que utiliza el algoritmo para generar acordes y progresiones, así como la relación entre la teoría musical y su representación mediante estructuras de datos y operaciones en Java.

---

## Consulta 4. Implementación de acordes, séptimas, inversiones y progresiones

**Herramienta utilizada:** Claude (Anthropic) / Claude Pro

**Pregunta realizada:**

¿Cómo implemento correctamente la parte musical? Los acordes, séptima, mayor, menor e inversiones.

**Respuesta obtenida:**

Claude proporcionó una explicación técnica sobre cómo organizar el motor musical de ChordLab para que los diferentes tipos de acordes puedan generarse mediante un mismo algoritmo.

La propuesta se basó en los siguientes elementos:

**1. Representación de las notas**

Cada nota debe almacenar dos valores:

- Letra musical: C, D, E, F, G, A o B.
- Alteración: bemol, natural o sostenido.

De esta manera se puede distinguir entre notas que suenan igual, pero que tienen una escritura musical diferente.

**2. Definición de intervalos**

Cada intervalo debe almacenar su distancia en semitonos y los pasos que avanza entre las letras musicales.

Por ejemplo:

- Tercera menor: 3 semitonos y 2 pasos.
- Tercera mayor: 4 semitonos y 2 pasos.
- Quinta justa: 7 semitonos y 4 pasos.
- Séptima menor: 10 semitonos y 6 pasos.
- Séptima mayor: 11 semitonos y 6 pasos.

**3. Catálogo de tipos de acordes**

Se propuso utilizar una tabla que almacene el nombre, símbolo y fórmula de intervalos de cada tipo de acorde.

Ejemplos:

- C mayor: C, E, G.
- C menor: C, Eb, G.
- C7: C, E, G, Bb.
- Cmaj7: C, E, G, B.
- Cm7: C, Eb, G, Bb.

Así se pueden incorporar nuevos tipos de acordes sin modificar el algoritmo principal.

**4. Cálculo de inversiones**

Las inversiones modifican la nota que ocupa la posición más grave del acorde.

Para un acorde de C mayor:

- Estado fundamental: C, E, G.
- Primera inversión: E, G, C.
- Segunda inversión: G, C, E.

En los acordes de séptima existen tres inversiones posibles, además del estado fundamental.

Para reproducir correctamente estas inversiones, las notas que cambian de posición deben elevarse una octava.

**5. Reproducción de sonidos**

Se explicó que Tone.js necesita recibir las notas con su respectiva octava.

Por ejemplo, la primera inversión de C mayor se puede representar como E4, G4 y C5.

También se revisó la numeración MIDI, donde C4 corresponde al valor 60, para facilitar la conversión de las notas a frecuencias y su reproducción.

**6. Generación de progresiones**

Se propuso generar progresiones utilizando los grados de una escala en lugar de definir acordes independientes para cada tonalidad.

Por ejemplo, la progresión I-V-vi-IV en C mayor corresponde a:

C – G – Am – F.

El mismo patrón puede trasladarse a otras tonalidades. También se explicaron las diferencias entre progresiones pop, clásicas, jazz y blues.

**7. Validaciones y pruebas**

Se recomendó validar las notas, tipos de acordes e inversiones solicitadas, evitando aceptar combinaciones que no existan.

También se propusieron pruebas para comprobar los resultados de los acordes, las escalas, las inversiones y las progresiones generadas.

**Aplicación en el proyecto:**

La información permitió definir una lógica musical organizada y reutilizable para ChordLab. Se identificaron las estructuras y operaciones necesarias para generar acordes, calcular inversiones, construir progresiones y preparar las notas que posteriormente serán reproducidas mediante el frontend.

---

## 5. Reflexión general del uso de IA

Las consultas realizadas mediante ChatGPT y Claude permitieron resolver dudas relacionadas con la configuración del entorno de desarrollo, la estructura de Spring Boot, la conexión con MySQL y los fundamentos de la implementación musical.

Las herramientas se utilizaron principalmente para obtener explicaciones técnicas y comprender cómo organizar las funcionalidades del sistema.

La información obtenida fue utilizada como apoyo para tomar decisiones de desarrollo y comprender los procedimientos necesarios para implementar las características de ChordLab. Los resultados deberán revisarse y comprobarse durante las pruebas del proyecto.

**Herramientas registradas:**
- ChatGPT.
- Claude (Anthropic), incluyendo Claude Pro.

**Responsable del registro:** Nino Alessandro Navarro Lam.