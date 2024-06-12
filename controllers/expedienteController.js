const iconv = require('iconv-lite');
const moment = require('moment');
const db = require('../models');
const Expediente = db.expediente;
const Colaborador = db.colaborador;
const Documento = db.documento;
const Puesto = db.puesto;
const { sequelize } = require('../models'); 
const { getFileLength, getDateUploaded } = require('../mjs/functions');

const createColaborador = async (data, transaction) => {  
  const { nombre, identificacion, correoElectronico, edad, domicilio, tipoJornada, fechaNacimiento, unidad, puesto, estado, equipo } = data;

  return await Colaborador.create({
    nombre,
    identificacion,
    correoElectronico: correoElectronico,
    edad,
    domicilio,
    fechaNacimiento,
    unidad,
    idPuesto: puesto,
    estado: estado,
    equipo: equipo,
    tipoJornada: tipoJornada
  }, { transaction });
};

const createExpediente = async (data, colaboradorId, transaction) => {
  const { fechaIngreso, fechaSalida } = data;

  return await Expediente.create({
    fechaIngreso,
    fechaSalida,
    idColaborador: colaboradorId,
  }, { transaction });
};

const createDocumentos = async (files, colaboradorId, transaction) => {
  if (!files || files.length === 0) {
    return [];
  }

  const documentos = await Promise.all(
    files.map(async ({ originalname, buffer }) => {
      const cadenaDecodificada = iconv.decode(Buffer.from(originalname, 'latin1'), 'utf-8');
      return await Documento.create({
        nombreArchivo: cadenaDecodificada,
        archivo: buffer,
        fechaSubida: getDateUploaded(),
        tamaño: getFileLength(buffer.length),
        idColaborador: colaboradorId,
      }, { transaction });
    })
  );

  return documentos;
};

exports.createColaboradorExpediente = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const colaborador = await createColaborador(req.body, t);
    const expediente = await createExpediente(req.body, colaborador.idColaborador, t);
    const documentos = await createDocumentos(req.files, colaborador.idColaborador, t);

    await t.commit(); 

    const sanitizedColaborador = { ...colaborador.dataValues };
    delete sanitizedColaborador.fotoCarnet;

    const sanitizedDocumentos = documentos.map((documento) => {
      const { archivo, ...rest } = documento.dataValues;
      return rest;
    });

    res.status(200).json({ message: 'Registro exitoso', expediente, colaborador: sanitizedColaborador, documentos: sanitizedDocumentos });

  } catch (error) {
    await t.rollback();
    console.error('Error en la transacción:', error.message);
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

exports.updateColabadorExpediente = async (req, res) => {

  const t = await sequelize.transaction();
  
  const nuevosDatosExpediente = req.body.expediente;
  const nuevosDatosColaborador = req.body.colaborador;
  const expedienteId = req.params.id;

  try {
    // Actualizar expediente
    await Expediente.update(nuevosDatosExpediente, {
      where: { idExpediente: expedienteId },
      transaction: t
    });

    // Obtener el idColaborador del expediente
    const expediente = await Expediente.findByPk(expedienteId);
    const idColaborador = expediente.idColaborador;

    // Actualizar colaborador
    await Colaborador.update(nuevosDatosColaborador, {
      where: { idColaborador: idColaborador },
      transaction: t
    });

    // Confirmar la transacción
    await t.commit();
    
    console.log('Actualización exitosa');
    res.status(200).send({
      message: 'Actualización exitosa!'   
    });

  } catch (error) {
    // En caso de error, realizar un rollback
    await t.rollback();
    
    console.error('Error al actualizar:', error);
    res.status(500).send({
      error: error
    });
    throw error; 
  }
};

exports.getEmployeeExpedient = (req, res) =>{
  const idColaborador = req.params.idColaborador; 

  Expediente.findOne({
    where: { idColaborador: idColaborador }, // Filtro para idColaborador igual a 1
    include: [
      {
        model: Colaborador,
        as: 'colaborador',
        include: [
          {
            model: Puesto,
            as: 'puesto',
          },
        ],
      },
    ],
  })
    .then(expediente => {
      if (expediente) {
        // Se encontró un expediente para el idColaborador proporcionado.
        res.status(200).json(expediente);
      } else {
        // No se encontró ningún expediente para el idColaborador proporcionado.
        res.status(404).json({ message: 'Expediente no encontrado' });
      }
    })
    .catch(err => {
      // Ocurrió un error en la búsqueda.
      res.status(500).json({ message: 'Error en la búsqueda del expediente', error: err });
    });

};

exports.create = (req, res) => {

    const errorMensaje = validarCamposNoNulos(req);
    if (errorMensaje) {
        res.json({
            status: '400',
            message: errorMensaje
        });
        return;
    }
    const expediente = req.body;
    Expediente.create(expediente)
      .then(data => {
        res.json({
            message: 'Expediente Registrado exitosamente!',
            status: '200',
            data: data
        });
       
      })
      .catch(err => {
        res.json({
          status: '500',  
          message: err.message || 'Ocurrió un error al registrar el expediente.'
        });
    });
};

exports.findAll = (req, res) => {
    Expediente.findAll({
      include: [
        {
          model: Colaborador,
          as: 'colaborador',
          attributes: {
            exclude: ['fotoCarnet'] // Excluye el campo fotoCarnet de la consulta
          }, 
          include: [
            {
              model: Puesto,
              as: 'puesto', 
            },
          ],
        },
      ],
      })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || 'Ocurrió un error al obtener los datos.'
          });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
  
    obtenerExpedientePorID(id)
      .then(data => {
        res.json({
            status: '200',
            data: data,
        });
      })
      .catch(err => {
        res.json({
            status: '404',
            message: err,
        });
      });
};

exports.update = (req, res, next) => {
    const id = req.params.id;
    const newData = req.body; 
  
    
    obtenerExpedientePorID(id) 
      .then(expediente => {
        expediente.update(newData)
          .then(updatedExpediente => {
            res.json({
                status: '200',
                message: 'Expediente actualizado exitosamente!',
                data: updatedExpediente,
              });
              req.datos = {...expediente.get()};
              next();
          })
          .catch(err => {
            res.status(500).send({ error: 'Error al actualizar el expediente', details: err, status: '500' });
          });
        })
        .catch(err => {
            res.status(404).send({ error: `No se encontró un expediente con ID ${id}`, status: '404' });
        });
};
  
exports.delete = (req, res) => {
    const id = req.params.id;

    obtenerExpedientePorID(id)
      .then(expediente => {
        expediente.destroy()
            .then(() => {
                res.json({
                    status: '200',
                    message: 'Expediente eliminado exitosamente',
                });
            })
            .catch(err => {
                res.json({
                    status: '500',
                    message: `Error al eliminar el expediente con ID ${id}`,
                    error: err.message || err,
                });
            });
        })
        .catch(err => {
            res.json({
                status: '404',
                message: `No se encontró el expediente con ID ${id}`,
            });
        });
};

exports.getEmployeesWithoutExpedient = async (req, res) => {
  try {
    const [colaboradores, expedientes] = await Promise.all([
      Colaborador.findAll(),
      Expediente.findAll()
    ]);

    const data = colaboradores.filter(colaborador => {
      return !expedientes.some(expediente => expediente.idColaborador === colaborador.idColaborador);
    });

    res.json({
      data: data,
    });

  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
};


function validarCamposNoNulos(req) {
    const camposNoNulos = ['fechaIngreso','idColaborador'];
    for (const campo of camposNoNulos) {
      if (!req.body[campo]) {
        return `El campo ${campo} no puede estar vacío`;
      }
    }
    return null; 
}

function obtenerExpedientePorID(id) {
    return new Promise((resolve, reject) => {
      Expediente.findByPk(id)
        .then(expediente => {
          if (!expediente) {
            reject(`No se encontró un expediente con ID ${id}`);
          } else {
            resolve(expediente);
          }
        })
        .catch(err => {
          reject(`Ocurrió un error al obtener el expediente con ID ${id}`);
        });
    });
}

exports.insertPhoto = async (req, res) => {
  const { idColaborador } = req.params;
  const { buffer: fotoCarnet } = req.file;

  try {
    const colaborador = await Colaborador.findByPk(idColaborador);

    if (!colaborador) {
      res.status(404).send({
           message: 'Colaborador no encontrado' 
      });
    }

    colaborador.fotoCarnet = fotoCarnet;

    await Colaborador.update(
      { fotoCarnet: fotoCarnet },
      { where: { idColaborador: idColaborador } }
    );

    res.status(200).send({ 
      message: 'Foto de carnet actualizada exitosamente'
   });
  } catch (error) {
    console.error('Error al actualizar la foto de carnet:', error.message);
    res.status(500).send({ 
      message: 'Error al actualizar la foto de carnet',
      error: error.message
    });
  }
};
















