const express = require('express');
const router = express.Router();
const ausenciaController = require('../controllers/ausencia.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/agregar-ausencia/', authenticateToken, ausenciaController.create);

router.put('/actualizar-ausencia/:id', authenticateToken, authorizeRoles(['admin']), ausenciaController.update);

router.get('/ausencias/', authenticateToken, authorizeRoles(['admin']), ausenciaController.findAll);

router.get('/ausencia/:id', authenticateToken, authorizeRoles(['admin']), ausenciaController.findOne);

router.get('/ausencias-por-colaborador/:id', authenticateToken, authorizeRoles(['admin']), ausenciaController.getAllAusenciasPorColaborador);

router.delete('/eliminar-ausencia/:id', authenticateToken, authorizeRoles(['admin']), ausenciaController.delete);

//Funciones especialies

//Busca en un rango de fechas 
//router.get('/ausencias-en-rango/', ausenciaController.getAusenciasEnRango);

module.exports = router;
