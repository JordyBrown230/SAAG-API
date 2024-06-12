const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const {auditLogin, auditLogout} = require('../middlewares/audit.middleware');


router.post('/login/', usuarioController.login, auditLogin);

router.post('/logout/:token',  usuarioController.logout, auditLogout);

router.post('/refresh/:token',  usuarioController.refreshToken);


module.exports = router;
