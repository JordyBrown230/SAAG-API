const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoria.controller');
const { authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware');


router.get('/auditorias/', authenticateToken, authorizeRoles(['admin']), auditoriaController.findAllAuditTables);

router.get('/auditoria/:id', authenticateToken, authorizeRoles(['admin']), auditoriaController.findOne);

router.delete('/eliminar-auditoria/:id', authenticateToken, authorizeRoles(['admin']), auditoriaController.delete);


module.exports = router;

