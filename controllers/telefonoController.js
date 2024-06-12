const db = require('../models');
const Telefono = db.telefono;

exports.create = (req, res) => {

    const telefono = req.body;
    
    Telefono.create(telefono)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Ocurrió un error al registrar la información.'
      });
      console.log(err);
    });
};


exports.findAll = (req, res) => {
  Telefono.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Ocurrió un error al obtener los telefonos.'
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Telefono.findByPk(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `No se encontró un registro con ID ${id}`
        });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ocurrió un error al obtener el registro con ID ${id}`
      });
    });
};

exports.findByColaborador = (req, res) => {

  Telefono.findAll({
    attributes: ['numeroTelefono', 'idTelefono'], // Corregido de 'atribbutes' a 'attributes'
    where: {
      idColaborador: req.params.id,
    }
  })
  .then(data => {
      if(data){
        res.status(200).send({
          data: data
        });
      }
  }).catch(error => {
      res.status(500).send({
        message: error,
      });
  });
};

exports.delete = (req, res) => {
  
  const id = req.params.id;
  console.log(id)
  Telefono.findByPk(id)
  .then(telefono => {
    if(!telefono){
      res.status(404).send({
        message: 'No se encontró el registro con el id: ' + id,
      });
    }else{
      telefono.destroy()
      .then(()=> {
        res.status(200).send({
          message: 'Registro eliminado exitosamente!.',
        });
      }).catch(error => {
        res.status(500).send({
          message: error
        });
      });
    }
  }).catch(error => {
    res.status(500).send({
      message: error
    });
  });
};

exports.update = (req, res) => {
  Telefono.findByPk(req.params.id)
    .then(telefono => {
      if (!telefono) {
        return res.status(404).send({
          message: 'Registro no encontrado',
        });
      }
      return telefono.update(req.body);
    })
    .then((updated) => {
      if(updated){
          res.status(200).send({
          message: 'Actualizado con éxito',
        });
      }else{
        res.status(500).send({
          message: 'No se pudo actualizar el registro. Verifica los campos y vuelve a intentarlo.',
        });
      }
    })
    .catch(error => {
      res.status(500).send({
        message: error.message || 'Ocurrió un error al intentar actualizar el registro',
      });
    });
};


