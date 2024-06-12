const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expedienteController');
const multer = require('multer');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage, encoding: 'utf-8' });

router.post('/expedientes/registrar-nuevo', authenticateToken, authorizeRoles(['admin']), upload.array('files', 10), expedienteController.createColaboradorExpediente);

router.post('/agregar-expediente/', authenticateToken, authorizeRoles(['admin']), expedienteController.create);

router.get('/expedientes/', authenticateToken, authorizeRoles(['admin']), expedienteController.findAll);

//router.get('/obtener-expediente/:id', expedienteController.findOne);

router.put('/actualizar-expediente/:id', authenticateToken, authorizeRoles(['admin']), expedienteController.update);

router.delete('/eliminar-expediente/:id', authenticateToken, authorizeRoles(['admin']), expedienteController.delete);

router.get('/colaborador-expediente/:idColaborador', authenticateToken, authorizeRoles(['admin']), expedienteController.getEmployeeExpedient);

router.get('/colaboradores-sin-expedientes/', authenticateToken, authorizeRoles(['admin']), expedienteController.getEmployeesWithoutExpedient);

router.put('/expedientes/actualizar-colaborador-expediente/:id', authenticateToken, authorizeRoles(['admin']), expedienteController.updateColabadorExpediente);

router.put('/colaborador/insertar-foto/:idColaborador', upload.single('fotoCarnet'), expedienteController.insertPhoto);

module.exports = router;



