const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware');

router.get('/admin', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.json({ message: 'Acceso permitido para el rol de administrador' });
});


router.post('/agregar-usuario/',  authenticateToken, authorizeRoles(['admin']), usuarioController.createUsuario);

router.post('/verificar-contrasena/',  authenticateToken, authorizeRoles(['admin','supervisor','empleado']), usuarioController.verificarContrasena);

router.get('/usuarios/', authenticateToken, authorizeRoles(['admin']), usuarioController.findAllUsuarios);

router.get('/usuario/:id', authenticateToken, authorizeRoles(['admin']), usuarioController.findOneUsuario);

router.put('/actualizar-usuario/:id', authenticateToken, authorizeRoles(['admin','supervisor','empleado']), usuarioController.updateUsuario);

router.delete('/eliminar-usuario/:id', authenticateToken, authorizeRoles(['admin']), usuarioController.deleteUsuario);

router.get('/supervisores', authenticateToken, authorizeRoles(['admin']), usuarioController.getAllSupervisors);

module.exports = router;
