const iconv = require('iconv-lite');
const db = require('../models');
const Colaborador = db.colaborador;
const Documento = db.documento;
const { getFileLength, getDateUploaded } = require('../mjs/functions');
const { Op } = require('sequelize');

exports.getDocsEmployee = async (req, res) => {
  const idColaborador = req.params.idColaborador;

  Documento.findAll({
    where: { idColaborador: idColaborador },
    attributes: {
      exclude: ['archivo']
    }
  })
  .then(documentos => {
    res.status(200).send(documentos);
  })
  .catch(error => {
    res.status(500).send({
      message: error
    });
  });
};

exports.findAll = (req, res) => {
  Documento.findAll({
    include: [
      {
        model: Colaborador,
        as: 'colaborador',
        attributes: {
          exclude: ['fotoCarnet']
        }
      },
    ],
    attributes: {
      exclude: ['archivo']
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || 'Ocurrió un error al obtener los datos.'
    });
  });
};


exports.uploadPdf = async (req, res) => {  
    try {

      const {idColaborador, licencia, curso, fechaVencimiento} = req.body;

        if (!req.files || req.files.length === 0) {
            res.status(400).send({
                status: '400',
                message: 'No ha seleccionado ningun archivo...'
            });
        }
        const pdfFiles = [];
        for (const file of req.files) {
            const { originalname, buffer } = file;
            const cadenaDecodificada = iconv.decode(Buffer.from(originalname, 'latin1'), 'utf-8');
            const length = getFileLength(buffer.length);
            const pdfFile = await Documento.create({
                licencia: licencia,
                curso: curso,
                nombreArchivo: cadenaDecodificada,
                archivo: buffer,
                tamano: length,
                fechaVencimiento: fechaVencimiento,
                fechaSubida: getDateUploaded(),
                idColaborador: idColaborador
            });
            pdfFiles.push(pdfFile); 
        }
        res.status(200).send({ 
          message: 'Registrado exitosamente!...'
        });
    } catch (error) {
        res.status(500).send({
          message: 'Ocurrió un error al registrar el (los) documento(s)...',
          error: error
        });
    }
};
  
exports.getFileById = async (req, res) => {
    try {
      const { id } = req.params;
      const file = await Documento.findByPk(id);
  
      if (!file) {
          res.status(404).send({
            message: 'Archivo no encontrado'
          });
      }else {
        let contentType = 'application/octet-stream'; // Por defecto, tipo binario
        const fileExtension = file.nombreArchivo.split('.').pop().toLowerCase();

        if (fileExtension === 'pdf') {
          contentType = 'application/pdf';
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          contentType = `image/${fileExtension}`;
        }
        // Establece las cabeceras de respuesta
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${file.nombreArchivo}"`);
        res.send(file.archivo);
     }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getPhotoCarnetById = async (req, res) => {
  try {
      const id  = req.params.idColaborador;
      const colaborador = await Colaborador.findByPk(id);
      if (!colaborador || !colaborador.fotoCarnet) {
          return res.status(404).send({
              message: 'Foto de carnet no encontrada'
          });
      }
      
      const contentType = 'image/jpeg';

      res.setHeader('Content-Type', contentType);
      res.send(colaborador.fotoCarnet);
  } catch (error) {
      console.error(errorerror);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getFotoCarnet = async (req, res) => {
  const idColaborador = req.params.idColaborador;
  
  try {
    const colaborador = await Colaborador.findByPk(idColaborador);
    
    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador no encontrado' });
    }

    const fotoCarnetBuffer = colaborador.fotoCarnet;

    if (!fotoCarnetBuffer) {
      return res.status(404).json({ message: 'Foto no registrada' });
    }

    const base64 = fotoCarnetBuffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64}`;

    res.json({ idColaborador, imageUrl });
  } catch (error) {
    console.error('Error al obtener la foto de carnet:', error.message);
    res.status(500).json({ message: 'Error al obtener la foto de carnet', error: error.message });
  }
};


exports.deleteDocumento = (req, res) => {
  
  Documento.findByPk(req.params.id)
  .then((documento)=> {
    if(documento){
      documento.destroy()
      .then(() => {
        res.status(200).send({
          message: 'Eliminado exitosamente!'
        });
      }).catch(error => {
        res.status(500).send({
          message: error
        });
      })
    }else{
      res.status(404).send({
        message: 'No se encontró ningún registro con el id especificado.'
      });
    }
  }).catch(error => {
    res.status(500).send({
      message: error
    });
  });
}


