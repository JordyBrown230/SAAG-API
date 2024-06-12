const moment = require('moment');

function getFileLength(length) {
  const tamanoArchivoBytes = length;
  const tamanoArchivoKB = tamanoArchivoBytes / 1024;
  const tamanoArchivoFormateado = `${tamanoArchivoKB.toFixed(2)} KB`;
  return tamanoArchivoFormateado;
}

function getDateUploaded() {
  const fechaSubida = new Date();
  //const fechaFormateada = moment(fechaSubida).format('YYYY-MM-DD');
  return fechaSubida;
}

module.exports = { getFileLength, getDateUploaded };
