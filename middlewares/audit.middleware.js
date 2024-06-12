const {createAuditTable} = require('../controllers/auditoria.controller');
const {createAuditLogin, updateAuditLogin} = require('../controllers/auditoriaLogin.controller');


const auditTables = async (req, res, next) => {

        try{       
            const datos = req.datos;
            const direccionIp = req.ip || req.connection.remoteAddress;
            const agenteUsuario = req.get('user-agent') || 'unknown';
            await createAuditTable(req, datos, direccionIp, agenteUsuario);

        }catch(error) {
            console.error(error);
          }
    next();
};

const auditLogin = async (req, res) => {

    try{  
        const nombreUsuario =  req.body.nombreUsuario;
        const exito = req.exito;
        const token = req.token;
        const direccionIp = req.ip || req.connection.remoteAddress;
        const agenteUsuario = req.get('user-agent') || 'unknown';
       console.log(exito);
        await createAuditLogin(req, res, nombreUsuario, exito, token, direccionIp, agenteUsuario);

    }catch(error) {
        console.error(error);
      }
};

const auditLogout = async (req, res) => {


    try{  
        const token = req.params.token;
       
        await updateAuditLogin(req, res, token);

    }catch(error) {
        console.error(error);
      }
};


module.exports = { auditTables, auditLogin, auditLogout };