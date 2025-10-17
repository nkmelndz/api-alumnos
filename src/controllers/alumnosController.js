const Alumno = require('../models/Alumno');
const { validationResult } = require('express-validator');

const alumnosController = {
  // GET /alumnos - Obtener todos los alumnos
  async getAllAlumnos(req, res) {
    try {
      const alumnos = await Alumno.getAll();
      res.status(200).json({
        success: true,
        data: alumnos,
        total: alumnos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // GET /alumnos/:id - Obtener un alumno por ID
  async getAlumnoById(req, res) {
    try {
      const { id } = req.params;
      const alumno = await Alumno.getById(id);
      
      if (!alumno) {
        return res.status(404).json({
          success: false,
          message: 'Alumno no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: alumno
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // POST /alumnos - Crear un nuevo alumno
  async createAlumno(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      
      // Verificar si el email ya existe
      const existingAlumno = await Alumno.findByEmail(email);
      if (existingAlumno) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un alumno con este email'
        });
      }
      
      const nuevoAlumno = await Alumno.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Alumno creado exitosamente',
        data: nuevoAlumno
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // PUT /alumnos/:id - Actualizar un alumno
  async updateAlumno(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { email } = req.body;
      
      // Verificar si el alumno existe
      const alumnoExistente = await Alumno.getById(id);
      if (!alumnoExistente) {
        return res.status(404).json({
          success: false,
          message: 'Alumno no encontrado'
        });
      }
      
      // Verificar si el email ya existe en otro alumno
      const alumnoConEmail = await Alumno.findByEmail(email);
      if (alumnoConEmail && alumnoConEmail.id != id) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otro alumno con este email'
        });
      }
      
      const alumnoActualizado = await Alumno.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Alumno actualizado exitosamente',
        data: alumnoActualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // DELETE /alumnos/:id - Eliminar un alumno
  async deleteAlumno(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar si el alumno existe
      const alumno = await Alumno.getById(id);
      if (!alumno) {
        return res.status(404).json({
          success: false,
          message: 'Alumno no encontrado'
        });
      }
      
      const eliminado = await Alumno.delete(id);
      
      if (eliminado) {
        res.status(200).json({
          success: true,
          message: 'Alumno eliminado exitosamente'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al eliminar el alumno'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = alumnosController;