const db = require('../models');
const HorasExtras = db.horasExtra;

exports.createHorasExtras = async (req, res) => {  // se debe realizar correo?
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({
                message: 'No puede venir sin datos'
            });
        }
        const nuevasHorasExtras = await HorasExtras.create(req.body);
        
        res.status(200).send({
            message: `Agregadas correctamente las horas extras para el colaborador ${req.body.idColaborador}`,
            data: nuevasHorasExtras
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Ocurrió un error al crear las horas extras.'
        });
    }
};

exports.findAllHorasExtras = async (req, res) => {
    HorasExtras.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: err.message || 'Ocurrió un error al obtener las horas extras.'
        });
    });
};

exports.findOneHorasExtras = async (req, res) => {
    const id = req.params.id;

    HorasExtras.findByPk(id)
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `No se encontraron horas extras con ID ${id}`
        });
        } else {
        res.send(data);
        next();
        }
    })
    .catch(err => {
        res.status(500).send({
        message: `Ocurrió un error al obtener las horas extras con ID ${id}`
        });
    });
};

exports.updateHorasExtras = async (req, res) => {
    const id = req.params.id;

    HorasExtras.findByPk(id)
    .then(horasExtras => {
        if (!horasExtras) {
        res.status(404).send({
            message: `No se encontraron horas extras con ID ${id}`
        });
        } else {

        req.datos = {...horasExtras.get()};

        horasExtras.update(req.body)
            .then(() => {
            res.status(200).send({
                message: `Actualizadas correctamente las horas extras con ID ${id}`,
                horasExtras: horasExtras
            });
            next();
            })
            .catch(err => {
            res.status(500).send({
                message: `Ocurrió un error al actualizar las horas extras con ID ${id}: ${err.message}`
            });
            });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: `Ocurrió un error al obtener las horas extras con ID ${id}: ${err.message}`
        });
    });
};

exports.deleteHorasExtras = async (req, res) => {
    const id = req.params.id;

    HorasExtras.findByPk(id)
    .then(horasExtras => {
        if (!horasExtras) {
        res.status(404).send({
            message: `No se encontraron horas extras con ID ${id}`
        });
        } else {

        req.datos = {...horasExtras.get()};

        horasExtras.destroy()
            .then(() => {
            res.send({
                message: 'Las horas extras fueron eliminadas exitosamente'
            });
            })
            .catch(err => {
            res.status(500).send({
                message: err.message || `Ocurrió un error al eliminar las horas extras con ID ${id}`
            });
            next();
            });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: `Ocurrió un error al obtener las horas extras con ID ${id}`
        });
    });
};