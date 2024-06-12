const express = require('express');
const router = express.Router();
const telefonoController = require('../controllers/telefonoController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/telefonos/agregar-telefono/', authenticateToken, authorizeRoles(['admin']), telefonoController.create);

router.get('/telefonos/obtener-por-colaborador/:id', authenticateToken, authorizeRoles(['admin']), telefonoController.findByColaborador);

router.put('/telefonos/actualizar-telefono/:id', authenticateToken, authorizeRoles(['admin']), telefonoController.update);

router.delete('/telefonos/eliminar-telefono/:id', authenticateToken, authorizeRoles(['admin']), telefonoController.delete);

module.exports = router;

