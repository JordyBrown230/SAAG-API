const db = require('../models');
const Ausencia = db.ausencia;
const Colaborador = db.colaborador; // Import the Colaborador model if not already imported
const { Op } = require('sequelize');


// Crea una nueva ausencia
exports.create = (req, res) => {
  if (req.body.length==0) {
    res.status(400).send({
      message: 'No puede venir sin datos'
    });
    return;
  }
  // Crea una nueva ausencia
  Ausencia.create(req.body)  // crear e envio de correos?
    .then(data => {
      res.status(200).send({
        message: `Agregada correctamente la ausencia de ${req.body.nombreColaborador}`
      });     
     })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Ocurrió un error al crear la ausencia.'
      });
    });
};


exports.findAll = (req,res) => { //en Express.js toman dos argumentos: req (la ausencia) y res (la respuesta).
  Ausencia.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Ocurrió un error al obtener las ausencias.'
      });
    });
};

// Obtiene una ausencia por ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Ausencia.findByPk(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `No se encontró una ausencia con ID ${id}`
        });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ocurrió un error al obtener la ausencia con ID ${id}`
      });
    });
};

// Actualiza una ausencia por ID
exports.update = (req, res) => {
  const id = req.params.id;
  // Busca la ausencia en la base de datos
  Ausencia.findByPk(id)
    .then(ausencia => {
      if (!ausencia) {
        res.status(404).send({
          message: `No se encontró una ausencia con ID ${id}`
        });
      } else {

        req.datos = {...ausencia.get()};
        // Actualiza la ausencia con los nuevos datos del cuerpo de la ausencia
        ausencia.update(req.body)
          .then(() => {
            res.status(200).send({
              message: `Actualizada correctamente la ausencia con ID ${id}`
            });
          })
          .catch(err => {
            res.status(500).send({
              message: `Ocurrió un error al actualizar la ausencia con ID ${id}: ${err.message}`
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ocurrió un error al obtener la ausencia con ID ${id}: ${err.message}`
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;

  // Busca la ausencia en la base de datos
  Ausencia.findByPk(id)
    .then(ausencia => {
      if (!ausencia) {
        res.status(404).send({
          message: `No se encontró una ausencia con ID ${id}`
        });
      } else {

        req.datos = {...ausencia.get()};
        // Elimina la ausencia de la base de datos
        ausencia.destroy()
          .then(() => {
            res.send({
              message: 'La ausencia fue eliminada exitosamente'
            });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || `Ocurrió un error al eliminar la ausencia con ID ${id}`
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ocurrió un error al obtener la ausencia con ID ${id}`
      });
    });
};

exports.getAllAusenciasPorColaborador = (req, res) => {
  const colaboradorId = req.params.id;

  Ausencia.findAll({
    where: { idColaborador: colaboradorId },
    include: [{ model: Colaborador, as: 'colaborador' }],
  })
    .then(data => {
      if (data.length === 0) {
        res.status(404).send({
          message: 'No se encontraron ausencias para este colaborador',
        });
      } else {
        res.send(data);
        //next();
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Ocurrió un error al obtener las ausencias del colaborador.',
      });
    });
};
/*
exports.getAusenciasEnRango = async (req, res) => {
  try {
    let { fechaInicio, fechaFin } = req.body;

    const whereClause = {};

    if (fechaInicio) {
      whereClause.fechaAusencia = {
        [Op.gte]: fechaInicio + ' 00:00:00',
      };
    }

    if (fechaFin) {
      if (!fechaInicio) {
        whereClause.fechaAusencia = {};
      }

      whereClause.fechaAusencia[Op.lte] = fechaFin + ' 23:59:59';
    }

    const ausencias = await Ausencia.findAll({
      where: whereClause,
      include: [{ model: Colaborador, as: 'colaborador' }],
    });

    if (ausencias.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron ausencias en el rango de fechas especificado',
      });
    }

    return res.json(ausencias);
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Ocurrió un error al buscar las ausencias en el rango de fechas.',
    });
  }
};
*/