# 02. Requisitos del sistema – ChordLab

## 1. Requerimientos funcionales

Los requerimientos funcionales describen las acciones y operaciones que los usuarios podrán realizar dentro de la plataforma ChordLab.

### 1.1 Administración de usuarios

**RF01. Registro de usuarios:** El sistema permitirá crear una cuenta mediante un formulario que solicite nombre, correo electrónico y contraseña.

**RF02. Inicio y cierre de sesión:** Los usuarios podrán ingresar a la plataforma con sus credenciales y cerrar sesión cuando lo deseen.

**RF03. Administración del perfil:** El usuario podrá consultar y modificar sus datos personales.

### 1.2 Administración de proyectos musicales

**RF04. Creación de proyectos:** El usuario podrá crear nuevos proyectos musicales dentro de su cuenta.

**RF05. Edición y eliminación de proyectos:** El usuario podrá consultar, modificar y eliminar los proyectos que haya creado.

**RF06. Configuración musical:** Cada proyecto permitirá configurar la tonalidad, escala, tempo (BPM) y compás de la composición.

### 1.3 Generación y edición de acordes

**RF07. Generación de acordes:** El sistema permitirá generar acordes seleccionando una nota fundamental y un tipo de acorde, como mayor, menor, disminuido, aumentado y séptima.

**RF08. Consulta de notas:** El sistema mostrará las notas musicales que componen cada acorde generado.

**RF09. Visualización de acordes:** Los acordes podrán visualizarse mediante representaciones gráficas de un teclado de piano y diagramas de posiciones en guitarra.

### 1.4 Generación de progresiones armónicas

**RF10. Generación de progresiones:** El sistema permitirá crear progresiones armónicas de acuerdo con la tonalidad y escala seleccionadas.

**RF11. Edición de progresiones:** El usuario podrá agregar, eliminar, modificar y reorganizar los acordes que forman una progresión musical.

### 1.5 Reproducción musical

**RF12. Reproducción de acordes y progresiones:** El sistema permitirá escuchar acordes individualmente y progresiones completas.

**RF13. Selección de instrumentos virtuales:** El usuario podrá elegir diferentes instrumentos para reproducir sus composiciones, como piano, guitarra y sintetizador.

### 1.6 Organización y almacenamiento

**RF14. Guardado de composiciones:** El usuario podrá almacenar sus acordes, progresiones y composiciones dentro de sus proyectos musicales.

**RF15. Organización por secciones:** El sistema permitirá organizar las composiciones en diferentes secciones, como introducción, verso, coro y puente.

### 1.7 Compartir proyectos

**RF16. Compartir composiciones:** El usuario podrá generar enlaces para compartir sus proyectos musicales con otras personas.

**RF17. Acceso a proyectos compartidos:** Los usuarios podrán consultar o editar los proyectos compartidos de acuerdo con los permisos establecidos por su propietario.

## 2. Requerimientos no funcionales

Los requerimientos no funcionales establecen las condiciones técnicas y características que deberá cumplir ChordLab para garantizar su funcionamiento.

### 2.1 Usabilidad y compatibilidad

**RNF01. Compatibilidad:** La aplicación deberá funcionar correctamente en navegadores web modernos.

**RNF02. Adaptabilidad:** La interfaz deberá ajustarse a diferentes tamaños de pantalla y dispositivos.

**RNF03. Facilidad de uso:** El sistema deberá contar con una interfaz intuitiva que facilite la navegación y el uso de las herramientas musicales.

### 2.2 Seguridad

**RNF04. Protección de contraseñas:** Las contraseñas de los usuarios deberán almacenarse mediante algoritmos seguros de hash.

**RNF05. Control de acceso:** Cada usuario tendrá acceso únicamente a los proyectos que le pertenezcan o a aquellos que hayan sido compartidos con él mediante los permisos correspondientes.

**RNF06. Validación de información:** El sistema deberá validar los datos ingresados por los usuarios antes de procesarlos o almacenarlos.

### 2.3 Rendimiento y funcionamiento

**RNF07. Comunicación:** La comunicación entre el frontend y el backend deberá realizarse mediante una API REST.

**RNF08. Intercambio de información:** Los datos enviados y recibidos entre frontend y backend deberán manejarse en formato JSON.

**RNF09. Reproducción de audio:** La reproducción musical deberá ejecutarse directamente desde el navegador web, sin requerir la instalación de programas adicionales.

**RNF10. Manejo de errores:** El sistema deberá informar al usuario cuando ocurra un error durante alguna operación y evitar la pérdida de información.

### 2.4 Mantenimiento y desarrollo

**RNF11. Base de datos:** La información de usuarios, proyectos y composiciones deberá almacenarse en una base de datos MySQL.

**RNF12. Organización del código:** El código fuente deberá mantener una estructura organizada y modular que facilite su mantenimiento y futuras modificaciones.

**RNF13. Entorno de ejecución:** La aplicación deberá poder instalarse y ejecutarse en el entorno WSL establecido para el desarrollo del proyecto.