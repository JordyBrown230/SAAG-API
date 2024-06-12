const express = require('express');
const router = express.Router();
const horasExtrasController = require('../controllers/horasExtra.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/agregar-horas-extras/', authenticateToken, authorizeRoles(['admin']), horasExtrasController.createHorasExtras);

router.put('/actualizar-horas-extras/:id', authenticateToken, authorizeRoles(['admin']), horasExtrasController.updateHorasExtras);

router.get('/horas-extras/', authenticateToken, authorizeRoles(['admin']), horasExtrasController.findAllHorasExtras);

router.delete('/eliminar-horas-extras/:id', authenticateToken, authorizeRoles(['admin']), horasExtrasController.deleteHorasExtras);

router.get('/horas-extras/:id', authenticateToken, authorizeRoles(['admin']), horasExtrasController.findOneHorasExtras);
/*
router.post('/agregar-horas-extras/', horasExtrasController.createHorasExtras);
router.put('/actualizar-horas-extras/:id', horasExtrasController.updateHorasExtras);
router.get('/horas-extras/', horasExtrasController.findAllHorasExtras);
router.delete('/eliminar-horas-extras/:id', horasExtrasController.deleteHorasExtras);
router.get('/horas-extras/:id', horasExtrasController.findOneHorasExtras);
*/

module.exports = router;