const db = require("../models");
const Usuario = db.usuario;
const Colaborador = db.colaborador;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Puesto = db.puesto;

exports.createUsuario = async (req, res, next) => {
  console.log(req.body.nombreUsuario, req.body.idColaborador, req.body.contrasena);
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "No puede venir sin datos",
    });
  }
  if (!validarContrasena(req.body.contrasena)) {
    return res.status(400).send({
      message: "La contraseña no cumple con las reglas requeridas.",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);

  Usuario.create({
    nombreUsuario: req.body.nombreUsuario,
    contrasena: hashedPassword,
    rol: req.body.rol,
    idColaborador: req.body.idColaborador,
  })
    .then(data => {
      res.status(200).send({
        message: `Agregado correctamente el usuario del colaborador con id ${req.body.idColaborador}`,
        data: data,
      });
      next();
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el usuario.",
      });
    });
};

exports.findAllUsuarios = async (req, res, next) => {
  Usuario.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al obtener los usuarios.",
      });
    });
};

exports.findOneUsuario = (req, res, next) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `No se encontró un usuario con ID ${id}`,
        });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ocurrió un error al obtener el usuario con ID ${id}`,
      });
    });
};

exports.updateUsuario = async (req, res, next) => {
  const id = req.params.id;

  if (!req.body.nombreUsuario || !req.body.rol || !req.body.idColaborador) {
    return res.status(400).send({
      message: "Faltan campos requeridos.",
    });
  }

  if (req.body.contrasena && !validarContrasena(req.body.contrasena)) {
    return res.status(400).send({
      message: "La contraseña no cumple con las reglas requeridas.",
    });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).send({
        message: `No se encontró un usuario con ID ${id}`,
      });
    }

    const updateData = {
      nombreUsuario: req.body.nombreUsuario,
      rol: req.body.rol,
      idColaborador: req.body.idColaborador,
    };

    if (req.body.contrasena) {
      updateData.contrasena = await bcrypt.hash(req.body.contrasena, 10);
    }

    await usuario.update(updateData);

    res.status(200).send({
      message: `Actualizado correctamente el usuario con ID ${id}`,
      usuario: usuario,
    });

  } catch (err) {
    console.error('Error en el proceso de actualización:', err); // Agregamos un log para más detalle
    return res.status(500).send({
      message: `Ocurrió un error al actualizar el usuario con ID ${id}: ${err.message}`,
    });
  }
};

exports.deleteUsuario = (req, res, next) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then(usuario => {
      if (!usuario) {
        res.status(404).send({
          message: `No se encontró un usuario con ID ${id}`,
        });
      } else {
        req.datos = { ...usuario.get() };

        usuario.destroy()
          .then(() => {
            res.send({
              message: "El usuario fue eliminado exitosamente",
            });
            next();
          })
          .catch(err => {
            res.status(500).send({
              message: err.message || `Ocurrió un error al eliminar el usuario con ID ${id}`,
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ocurrió un error al obtener el usuario con ID ${id}`,
      });
    });
};

exports.login = async (req, res, next) => {
  const { nombreUsuario, contrasena } = req.body;

  Usuario.findOne({
    where: { nombreUsuario },
    include: [
      {
        model: Colaborador,
        as: 'colaborador',
        include: [
          {
            model: Puesto,
            as: 'puesto'
          },
          {
            model: Colaborador,
            as: 'supervisor',
            required: false
          }
        ]
      },
    ]
  })
    .then(async usuario => {
      if (!usuario) {
        req.exito = false;
        next();
        return res.status(401).json({ message: "Nombre de usuario inexistente" });
      }

      const verificarContrasena = await bcrypt.compare(contrasena, usuario.contrasena);

      if (!verificarContrasena) {
        req.exito = false;
        next();
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      const accessToken = jwt.sign(
        {
          nombreUsuario: usuario.nombreUsuario,
          id: usuario.idUsuario,
          rol: usuario.rol,
        },
        "secret_key",
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          nombreUsuario: usuario.nombreUsuario,
          id: usuario.idUsuario,
          rol: usuario.rol,
        },
        "secretRefresh_key",
        { expiresIn: "1h" }
      );

      await usuario.update({ refreshToken });

      const colaborador = usuario.colaborador;
      const supervisor = colaborador.supervisor;
      const nombreSupervisor = supervisor ? supervisor.nombre : null;

      req.exito = true;
      req.token = refreshToken;
      next();

      res.json({ colaborador, supervisor: nombreSupervisor, accessToken, refreshToken });
    })
    .catch(err => {
      res.status(500).json({ message: "Error interno del servidor" });
    });
};

exports.logout = (req, res, next) => {
  const refreshToken = req.params.token;

  if (!refreshToken) return res.sendStatus(401);

  Usuario.findOne({ where: { refreshToken } })
    .then(async usuario => {
      if (!usuario) {
        return res.status(401).json({ message: "Token inexistente" });
      }

      await usuario.update({ refreshToken: null });
      req.nombreUsuario = usuario.nombreUsuario;
      next();

      res.status(200).send({
        message: "Sesión cerrada exitosamente",
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Error interno del servidor" });
    });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.params.token;

  if (!refreshToken) return res.sendStatus(401);

  Usuario.findOne({ where: { refreshToken } })
    .then(async usuario => {
      if (!usuario) {
        return res.status(401).json({ message: "Token inexistente" });
      }

      const newToken = jwt.sign(
        {
          nombreUsuario: usuario.nombreUsuario,
          id: usuario.idUsuario,
          rol: usuario.rol,
        },
        "secret_key",
        { expiresIn: "15m" }
      );

      res.json({ newToken });
    })
    .catch(err => {
      res.status(500).json({ message: "Error interno del servidor" });
    });
};

function validarContrasena(contrasena) {
  return (
    contrasena.length >= 8 &&
    /[A-Z]/.test(contrasena) &&
    /[a-z]/.test(contrasena) &&
    /[0-9]/.test(contrasena) &&
    /[@#$%^&*_!.]/.test(contrasena)
  );
}

exports.getAllSupervisors = (req, res) => {
  Usuario.findAll({
    where: {
      rol: 'supervisor'
    }
  })
    .then(data => {
      if (data) {
        res.status(200).json({ data });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error });
    });
};

exports.verificarContrasena = async (req, res, next) => {
  const { idUsuario, contrasenaActual } = req.body;

  try {
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).send({
        message: `No se encontró un usuario con ID ${idUsuario}`,
      });
    }

    const esContrasenaValida = await bcrypt.compare(contrasenaActual, usuario.contrasena);
    if (!esContrasenaValida) {
      return res.status(401).send({
        message: "La contraseña actual es incorrecta",
      });
    }

    res.status(200).send({
      message: "La contraseña actual es correcta",
    });
  } catch (err) {
    console.error('Error al verificar la contraseña:', err);
    return res.status(500).send({
      message: `Ocurrió un error al verificar la contraseña: ${err.message}`,
    });
  }
};
