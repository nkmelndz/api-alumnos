-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS alumnos_db;
USE alumnos_db;

-- Crear la tabla de alumnos
CREATE TABLE IF NOT EXISTS alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  edad INT NOT NULL CHECK (edad > 0 AND edad < 120),
  curso VARCHAR(100) NOT NULL,
  fecha_ingreso DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar algunos datos de ejemplo
INSERT INTO alumnos (nombre, apellido, email, edad, curso, fecha_ingreso) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', 20, 'Ingeniería de Sistemas', '2024-01-15'),
('María', 'García', 'maria.garcia@email.com', 19, 'Administración', '2024-02-10'),
('Carlos', 'López', 'carlos.lopez@email.com', 21, 'Ingeniería Industrial', '2024-01-20');

-- Mostrar la estructura de la tabla
DESCRIBE alumnos;