const db = require('../models');
const Puesto = db.puesto;

exports.createPuesto = async (req, res, next) => {
    if (req.body.length==0) {
        res.status(400).send({
          message: 'No puede venir sin datos'
        });
        return;
      }
      // Crea una nueva puesto
      Puesto.create(req.body)
        .then(data => {
          res.status(200).send({
            message: `Agregada correctamente el Puesto con nombre ${req.body.nombrePuesto}`,
            data:data
          });   
          req.id = data.idPuesto;  
          next();
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || 'Ocurrió un error al crear el puesto.'
          });
        });
};

exports.findAllPuestos = async (req, res) => {
    Puesto.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: err.message || 'Ocurrió un error al obtener los puestos.'
        });
    });
};

exports.findOnePuesto = async (req, res) => {
    const id = req.params.id;

    Puesto.findByPk(id)
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `No se encontró un puesto con ID ${id}`
        });
        } else {
        res.send(data);
        next();
        }
    })
    .catch(err => {
        res.status(500).send({
        message: `Ocurrió un error al obtener el puesto con ID ${id}`
        });
    });
};

exports.updatePuesto = async (req, res) => {
    const id = req.params.id;

    Puesto.findByPk(id)
    .then(puesto => {
        if (!puesto) {
        res.status(404).send({
            message: `No se encontró un puesto con ID ${id}`
        });
        } else {

        req.datos = {...puesto.get()};

        puesto.update(req.body)
            .then(() => {
            res.status(200).send({
                message: `Actualizado correctamente el puesto con ID ${id}`,
                puesto: puesto
            });
            next();
            })
            .catch(err => {
            res.status(500).send({
                message: `Ocurrió un error al actualizar el puesto con ID ${id}: ${err.message}`
            });
            });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: `Ocurrió un error al obtener el puesto con ID ${id}: ${err.message}`
        });
    });
};

exports.deletePuesto = async (req, res, next) => {
    const id = req.params.id;

    Puesto.findByPk(id)
    .then(puesto => {
        if (!puesto) {
        res.status(404).send({
            message: `No se encontró un puesto con ID ${id}`
        });
        } else {

        req.datos = {...puesto.get()};

        puesto.destroy()
            .then(() => {
            res.send({
                message: 'El puesto fue eliminado exitosamente'
            });
            })
            .catch(err => {
            res.status(500).send({
                message: err.message || `Ocurrió un error al eliminar el puesto con ID ${id}`
            });
            next();
            });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: `Ocurrió un error al obtener el puesto con ID ${id}`
        });
    });
};
