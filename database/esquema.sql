---- Creacion de la BD ---
CREATE DATABASE IF NOT EXISTS chordlab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chordlab;

----- Creacion de tablas---

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- La tabla proyecto depende de la tabla usuario mediante una llave foranea -- 
CREATE TABLE proyecto (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    tonalidad VARCHAR(20),
    escala VARCHAR(30),
    tempo INT,
    compas_num INT,
    compas_den INT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_proyecto_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id_usuario) 
        ON DELETE CASCADE
);

--- Tabla seccion depende de proyecto --- 
CREATE TABLE seccion (
    id_seccion INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    orden INT NOT NULL,
    CONSTRAINT fk_seccion_proyecto FOREIGN KEY (id_proyecto) 
        REFERENCES proyecto(id_proyecto) 
        ON DELETE CASCADE
);

--- La tabla progresion depende de seccion ---
CREATE TABLE progresion (
    id_progresion INT AUTO_INCREMENT PRIMARY KEY,
    id_seccion INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    orden INT NOT NULL,
    CONSTRAINT fk_progresion_seccion FOREIGN KEY (id_seccion) 
        REFERENCES seccion(id_seccion) 
        ON DELETE CASCADE
);

CREATE TABLE acorde (
    id_acorde INT AUTO_INCREMENT PRIMARY KEY,
    id_progresion INT NOT NULL,
    fundamental VARCHAR(5) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    inversion INT DEFAULT 0,
    duracion_pulsos DECIMAL(4,2) NOT NULL,
    orden INT NOT NULL,
    CONSTRAINT fk_acorde_progresion FOREIGN KEY (id_progresion) 
        REFERENCES progresion(id_progresion) 
        ON DELETE CASCADE
);

--- La tabla compartir proyecto depende de proyecto ---
CREATE TABLE compartir_proyecto (
    id_compartir INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    permiso VARCHAR(15) NOT NULL CHECK (permiso IN ('lectura', 'edicion')),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NULL,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_compartir_proyecto FOREIGN KEY (id_proyecto) 
        REFERENCES proyecto(id_proyecto) 
        ON DELETE CASCADE
);

