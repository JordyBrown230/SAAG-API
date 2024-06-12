const db = require("../models");
const AuditoriaLogin = db.auditoriaLogin;


  exports.createAuditLogin = async (req, res, nombreUsuario, exito, token, direccionIp, agenteUsuario) => {
   
    if (req.body.length === 0) {
      res.status(400).send({
        message: "No puede venir sin datos",
      });
      return;
    }

      fecha = Date.now();

      AuditoriaLogin.create({
          nombreUsuario,
          fechaLogin: fecha,
          exito,
          token,
          direccionIp,
          agenteUsuario
      })
      .then((data) => {
        return;
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Ocurrió un error al crear la auditoria.",
        });
      });
  };

  exports.updateAuditLogin = async (req, res, token) => {
   

    AuditoriaLogin.findOne({ where: { token } })
    .then(async (auditoria) => {
      if (!auditoria) {
        return res
          .status(401)
          .json({ message: "token inexistente" });
      }

      const fecha = Date.now();

      auditoria.update({
          fechaLogout: fecha
      })
      .then((data) => {
  
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Ocurrió un error al crear la auditoria.",
        });
      });
    })
  };


  exports.findAllAuditLogins = async (req, res) => {
    try {
      const data = await AuditoriaLogin.findAll();
      res.send(data);
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        res.status(500).send({
          message: "Error en la base de datos. Verifica la configuración.",
        });
      } else {
        res.status(500).send({
          message: "Ocurrió un error al obtener los usuarios.",
        });
      }
    }
  };
  
 
  


// Obtiene una auditoria por ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  AuditoriaLogin.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se encontró una auditoria con ID ${id}`,
        });
      } else {
       return data;
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al obtener la auditoria con ID ${id}`,
      });
    });
};


exports.delete = (req, res, next) => {
  const id = req.params.id;

  // Busca el auditoria en la base de datos
  AuditoriaLogin.findByPk(id)
    .then((auditoria) => {
      if (!auditoria) {
        res.status(404).send({
          message: `No se encontró una auditoria con ID ${id}`,
        });
      } else {
        auditoria
          .destroy()
          .then(() => {
            res.send({
              message: "La auditoria fue eliminado exitosamente",
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                `Ocurrió un error al eliminar la auditoria con ID ${id}`,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al obtener la auditoria con ID ${id}`,
      });
    });
};
