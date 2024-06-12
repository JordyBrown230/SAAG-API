const express = require('express');
const router = express.Router();
const auditoriaLoginController = require('../controllers/auditoriaLogin.controller');
const { authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware');


router.get('/auditoriaslogin/', authenticateToken, authorizeRoles(['admin']), auditoriaLoginController.findAllAuditLogins);

router.get('/auditorialogin/:id', authenticateToken, authorizeRoles(['admin']), auditoriaLoginController.findOne);

router.delete('/eliminar-auditorialogin/:id', authenticateToken, authorizeRoles(['admin']), auditoriaLoginController.delete);


module.exports = router;

