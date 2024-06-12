const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitud.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,encoding: 'utf-8'})

router.post('/agregar-solicitud/',upload.single('comprobante'), authenticateToken, solicitudController.create);

router.put('/actualizar-solicitud/:id',upload.single('comprobante'), authenticateToken, solicitudController.update);

router.get('/solicitudes/', authenticateToken, authorizeRoles(['admin']), solicitudController.findAll);

router.get('/solicitudes-por-supervisor/:id', authenticateToken, authorizeRoles(['supervisor']), solicitudController.findAllBySupervisor);

router.get('/solicitud/:id', authenticateToken, authorizeRoles(['admin']), solicitudController.findOne);

router.get('/solicitudes-por-colaborador/:id', authenticateToken, authorizeRoles(['admin']), solicitudController.getAllSolicitudesPorColaborador);

router.get('/obtener-comprobante/:id',authenticateToken, solicitudController.getFileById);

router.delete('/eliminar-solicitud/:id', authenticateToken, authorizeRoles(['admin']), solicitudController.delete);

module.exports = router;
