const express = require('express');
const { body, param } = require('express-validator');
const alumnosController = require('../controllers/alumnosController');

const router = express.Router();

// Validaciones para crear/actualizar alumnos
const validarAlumno = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('edad')
    .isInt({ min: 1, max: 120 })
    .withMessage('La edad debe ser un número entre 1 y 120'),
  
  body('curso')
    .trim()
    .notEmpty()
    .withMessage('El curso es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El curso debe tener entre 2 y 100 caracteres')
];

// Validación para parámetros ID
const validarId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];

// Rutas
router.get('/', alumnosController.getAllAlumnos);
router.get('/:id', validarId, alumnosController.getAlumnoById);
router.post('/', validarAlumno, alumnosController.createAlumno);
router.put('/:id', [...validarId, ...validarAlumno], alumnosController.updateAlumno);
router.delete('/:id', validarId, alumnosController.deleteAlumno);

module.exports = router;