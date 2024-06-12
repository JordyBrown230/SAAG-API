const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const multer = require('multer');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage, encoding: 'utf-8' });

router.delete('/eliminar-documento/:id', documentoController.deleteDocumento);

router.post('/documentos/registrar-documento', upload.array('file', 10), documentoController.uploadPdf);

router.get('/obtener-documento/:id', documentoController.getFileById);

router.get('/colaborador-documento/:idColaborador',  documentoController.getDocsEmployee);

router.get('/documentos/obtener-foto/:idColaborador',  documentoController.getFotoCarnet);

router.get('/documentos/obtener-fotoCarnet/:idColaborador',  documentoController.getPhotoCarnetById);

router.get('/documentos/', authenticateToken, authorizeRoles(['admin']), documentoController.findAll);

module.exports = router;


