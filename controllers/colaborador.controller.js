const db = require('../models');
const Colaborador = db.colaborador;
const Usuario = db.usuario;
const Puesto = db.puesto;

exports.createColaborador = async (req, res, next) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: 'No puede venir sin datos'
        });
    }

    Colaborador.create(req.body)
        .then(async data => {
            res.status(200).send({
                message: `Agregada correctamente la solicitud de ${req.body.nombre}`,
                data:data
            }); 
        next();
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || 'Ocurrió un error al crear la solicitud.'
        });
    });
};

exports.findAllColaboradores = async (req, res, next) => {
    Colaborador.findAll({
        include: [
            {
                model: Puesto,
                as: 'puesto',
            },
            {
                model: Colaborador,
                as: 'supervisor',
                required: false
            }
        ]
    })
    .then(data => {
        res.send(data);
    })  
    .catch(err => {
        res.status(500).send({
        message: err.message || 'Ocurrió un error al obtener los colaboradores.'
        });
    });
};

exports.findAllColaboradoresWithUser = async (req, res, next) => {
    try {
        const colaboradores = await Colaborador.findAll({
            include: [
                {
                    model: Puesto,
                    as: 'puesto',
                }
            ],
            attributes: { exclude: ['fotoCarnet'] } 
        });

        const colaboradoresConUsuario = await Promise.all(colaboradores.map(async (colaborador) => {
            if (colaborador.idColaborador !== undefined) { // Verificar si el ID del colaborador está definido
                const usuario = await Usuario.findOne({ where: { idColaborador: colaborador.idColaborador } });
                return {
                    colaborador: colaborador,
                    usuario: usuario
                };
            } else {
                return {
                    colaborador: colaborador,
                    usuario: null 
                };
            }
        }));

        res.send(colaboradoresConUsuario);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Ocurrió un error al obtener los colaboradores.'
        });
    }
};

exports.findOneColaborador = async (req, res) => {
    const id = req.params.id;

    Colaborador.findByPk(id, {
        include: [
            {
                model: Puesto,
                as: 'puesto',
            }
        ]
    })
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `No se encontró un colaborador con ID ${id}`
        });
        } else {
        res.send(data);
        }
    })
    .catch(err => {
        res.status(500).send({
        message: `Ocurrió un error al obtener el colaborador con ID ${id}`
        });
    });
};

exports.findUsuarioByColaboradorId = async (req, res) => {
    const idColaborador = req.params.idColaborador;

    try {
        const usuario = await Usuario.findOne({
            where: { idColaborador: idColaborador }
        });

        if (!usuario) {
            return res.status(404).send({
                message: `No se encontró un usuario con idColaborador ${idColaborador}`
            });
        }

        res.send(usuario);
    } catch (err) {
        res.status(500).send({
            message: `Ocurrió un error al obtener el usuario con idColaborador ${idColaborador}: ${err.message}`
        });
    }
};


exports.updateColaborador = async (req, res,next) => {
    const id = req.params.id;

    Colaborador.findByPk(id)
    .then(colaborador => {
        if (!colaborador) {
            res.status(404).send({
                message: `No se encontró un colaborador con ID ${id}`
            });
        } else {

            req.datos = {...colaborador.get()};

            colaborador.update(req.body)
            .then(() => {
                res.status(200).send({
                    message: `Actualizado correctamente el colaborador con ID ${id}`,
                    colaborador: colaborador
                });
                next();
            })
            .catch(err => {
                res.status(500).send({
                    message: `Ocurrió un error al actualizar el colaborador con ID ${id}: ${err.message}`
                });
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Ocurrió un error al obtener el colaborador con ID ${id}: ${err.message}`
        });
    });
};

exports.deleteColaborador = async (req, res, next) => {
    const id = req.params.id;

    Colaborador.findByPk(id)
    .then(colaborador => {
        if (!colaborador) {
            res.status(404).send({
                message: `No se encontró un colaborador con ID ${id}`
            });
        } else {

            req.datos = {...colaborador.get()};

            colaborador.destroy()
            .then(() => {
                res.send({
                    message: 'El colaborador fue eliminado exitosamente'
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || `Ocurrió un error al eliminar el colaborador con ID ${id}`
                });
            //next();
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Ocurrió un error al obtener el colaborador con ID ${id}`
        });
    });
};


exports.findColaboradoresSinUsuario = async (req, res) => {
    try {
    // Obtener todos los colaboradores
    const colaboradores = await Colaborador.findAll();

    // Obtener todos los usuarios y extraer los id de colaborador
    const usuarios = await Usuario.findAll();
    const idsColaboradoresConUsuario = usuarios.map(usuario => usuario.idColaborador);

    // Filtrar colaboradores que no tienen usuario asignado
    const colaboradoresSinUsuario = colaboradores.filter(colaborador => !idsColaboradoresConUsuario.includes(colaborador.idColaborador));

    if (colaboradoresSinUsuario.length === 0) {
        return res.status(404).send({
            message: 'No se encontraron colaboradores sin usuario asignado',
        });
    }

    return res.send(colaboradoresSinUsuario);
    } catch (error) {
        return res.status(500).send({
            message: `Ocurrió un error al obtener los colaboradores sin usuario: ${error.message}`,
        });
    }
};

    







