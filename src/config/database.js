require('dotenv').config();

// Detectar el tipo de base de datos basado en las variables de entorno
const dbType = process.env.DATABASE_URL ? 'postgres' : 'mysql';

let pool, testConnection;

if (dbType === 'postgres') {
  // Configuración para PostgreSQL (Render)
  const { Pool } = require('pg');
  
  const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
  };
  
  pool = new Pool(dbConfig);
  
  testConnection = async () => {
    try {
      const client = await pool.connect();
      console.log('✅ Conexión a PostgreSQL establecida correctamente');
      client.release();
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con PostgreSQL:', error.message);
      return false;
    }
  };
} else {
  // Configuración para MySQL (Docker local)
  const mysql = require('mysql2/promise');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'alumnos_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  
  pool = mysql.createPool(dbConfig);
  
  testConnection = async () => {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Conexión a MySQL establecida correctamente');
      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con MySQL:', error.message);
      return false;
    }
  };
}

console.log(`🗄️  Usando base de datos: ${dbType.toUpperCase()}`);

module.exports = {
  pool,
  testConnection,
  dbType
};