const { pool } = require('../config/database');

class Alumno {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.email = data.email;
    this.edad = data.edad;
    this.curso = data.curso;
    this.fecha_ingreso = data.fecha_ingreso;
  }

  // Obtener todos los alumnos
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM alumnos ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener alumnos: ${error.message}`);
    }
  }

  // Obtener un alumno por ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM alumnos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener alumno: ${error.message}`);
    }
  }

  // Crear un nuevo alumno
  static async create(alumnoData) {
    try {
      const { nombre, apellido, email, edad, curso } = alumnoData;
      const fecha_ingreso = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
      
      const [result] = await pool.execute(
        'INSERT INTO alumnos (nombre, apellido, email, edad, curso, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, edad, curso, fecha_ingreso]
      );
      
      return {
        id: result.insertId,
        nombre,
        apellido,
        email,
        edad,
        curso,
        fecha_ingreso
      };
    } catch (error) {
      throw new Error(`Error al crear alumno: ${error.message}`);
    }
  }

  // Actualizar un alumno
  static async update(id, alumnoData) {
    try {
      const { nombre, apellido, email, edad, curso } = alumnoData;
      
      const [result] = await pool.execute(
        'UPDATE alumnos SET nombre = ?, apellido = ?, email = ?, edad = ?, curso = ? WHERE id = ?',
        [nombre, apellido, email, edad, curso, id]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar alumno: ${error.message}`);
    }
  }

  // Eliminar un alumno
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM alumnos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error al eliminar alumno: ${error.message}`);
    }
  }

  // Buscar alumnos por email (para validar unicidad)
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM alumnos WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error al buscar por email: ${error.message}`);
    }
  }
}

module.exports = Alumno;