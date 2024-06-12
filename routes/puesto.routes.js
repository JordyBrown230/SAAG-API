const express = require('express');
const router = express.Router();
const puestoController = require('../controllers/puesto.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/agregar-puesto/', authenticateToken, authorizeRoles(['admin']), puestoController.createPuesto);

router.put('/actualizar-puesto/:id', authenticateToken, authorizeRoles(['admin']), puestoController.updatePuesto);

router.get('/puestos/', authenticateToken, authorizeRoles(['admin']), puestoController.findAllPuestos);

router.delete('/eliminar-puesto/:id', authenticateToken, authorizeRoles(['admin']), puestoController.deletePuesto);

router.get('/puesto/:id', authenticateToken, authorizeRoles(['admin']), puestoController.findOnePuesto);

module.exports = router;