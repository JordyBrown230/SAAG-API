const db = require("../models");
const Auditoria = db.auditoria;


exports.createAuditTable = async (req, datos, direccionIp, agenteUsuario) => {
  
  try {
    
    const { user, body, method, id: reqId } = req;
    if (!user || !user.id) {
      throw new Error("Usuario no autenticado o falta el ID de usuario.");
    }

    if (Object.keys(body).length === 0) {
      throw new Error("No puede venir sin datos");
    }

    const { id, nombreUsuario, rol } = user;
    const nombre = req.originalUrl.substring(6);
    let datosAntiguos = null;
    let datosNuevos = null;
    let accion = null;

    if (method === 'POST') {
      accion = "Creación";
      if (reqId) {
        body[Object.keys(body)[0]] = reqId;
      }
      datosNuevos = parseDataToString(body);
    } else if (method === 'PUT') {
      accion = "Actualización";
      const filtrarDatos = filtrarCambios(datos, body);
      datosAntiguos = parseDataToString(filtrarDatos.datosAntiguos);
      datosNuevos = parseDataToString(filtrarDatos.nuevosDatos);
    } else if (method === 'DELETE') {
      accion = "Eliminación";
      datosAntiguos = parseDataToString(datos);
    }

    await Auditoria.create({
      idUsuario: id,
      nombreUsuario,
      rol,
      accion,
      nombre,
      datosAntiguos,
      datosNuevos,
      direccionIp,
      agenteUsuario
    });

    return null;
  } catch (error) {
    return error;
  }
};

function filtrarCambios(datosAntiguos, nuevosDatos) {
  const filtrarDatosAntiguos = {};
  const filtrarNuevosDatos = {};

  Object.keys(nuevosDatos).forEach(key => {
    if (datosAntiguos.hasOwnProperty(key) && nuevosDatos[key] !== datosAntiguos[key]) {
      filtrarDatosAntiguos[key] = datosAntiguos[key];
      filtrarNuevosDatos[key] = nuevosDatos[key];
    }
  });

  return { datosAntiguos: filtrarDatosAntiguos, nuevosDatos: filtrarNuevosDatos };
}


function parseDataToString(data) {
  return Object.entries(data).map(([key, value]) => `${key}: ${value}`).join(', ');
}

exports.findAllAuditTables = async (req, res) => {
    try {
      const data = await Auditoria.findAll();
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

  Auditoria.findByPk(id)
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
  Auditoria.findByPk(id)
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
              message: "La auditoria fue eliminada exitosamente",
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
