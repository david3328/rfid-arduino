const express = require('express');
const router = express.Router();
const {listar,insertar,buscar} = require('../controllers/alumnoController');

router.get('/alumnos',listar);
router.get('/alumnos/:idAlumno',buscar);
router.post('/alumnos',insertar);

module.exports = router;