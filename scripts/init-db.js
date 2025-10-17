const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  console.log('🔍 Verificando configuración de base de datos...');
  
  // Solo ejecutar si estamos usando PostgreSQL
  if (!process.env.DATABASE_URL) {
    console.log('📄 DATABASE_URL no encontrada, saltando inicialización...');
    console.log('💡 Esto es normal en desarrollo local con MySQL');
    return;
  }

  console.log('🗄️ DATABASE_URL encontrada, inicializando PostgreSQL...');

  try {
    const { Pool } = require('pg');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    });
    
    console.log('🔌 Conectando a la base de datos...');
    
    // Probar conexión primero
    const client = await pool.connect();
    console.log('✅ Conexión establecida');
    client.release();
    
    // Crear tabla de alumnos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumnos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        edad INTEGER NOT NULL CHECK (edad > 0 AND edad < 120),
        curso VARCHAR(100) NOT NULL,
        fecha_ingreso DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear función para actualizar updated_at automáticamente
    await pool.query(`
      CREATE OR REPLACE FUNCTION actualizar_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    // Crear trigger para actualizar updated_at
    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_actualizar_updated_at ON alumnos;
      CREATE TRIGGER trigger_actualizar_updated_at
          BEFORE UPDATE ON alumnos
          FOR EACH ROW
          EXECUTE FUNCTION actualizar_updated_at();
    `);
    
    // Insertar datos de ejemplo (solo si no existen)
    await pool.query(`
      INSERT INTO alumnos (nombre, apellido, email, edad, curso, fecha_ingreso) VALUES
      ('Juan', 'Pérez', 'juan.perez@email.com', 20, 'Ingeniería de Sistemas', '2024-01-15'),
      ('María', 'García', 'maria.garcia@email.com', 19, 'Administración', '2024-02-10'),
      ('Carlos', 'López', 'carlos.lopez@email.com', 21, 'Ingeniería Industrial', '2024-01-20')
      ON CONFLICT (email) DO NOTHING
    `);
    
    console.log('✅ Base de datos inicializada correctamente');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    
    // No fallar el build por problemas de BD en el primer despliegue
    if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
      console.log('💡 Las tablas ya existen, continuando...');
      return;
    }
    
    // Solo fallar si es un error crítico
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Error en producción, pero continuando el despliegue...');
      return;
    }
    
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;