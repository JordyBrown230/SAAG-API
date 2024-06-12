const transporter = require('../models/gmail');
require('dotenv').config();

// funcion global para enviar correos desde cualquier controller
const enviarCorreo = async (toList, subject, htmlContent) => {
    const from = { GM_MAIL } = process.env; 
    // Verifica si toList es una cadena (un solo correo) o una matriz (varios correos)
    const destinatarios = Array.isArray(toList) ? toList.join(', ') : toList;
    console.log('Enviando correo a:', destinatarios);
    try {
        await transporter.sendMail({    //estructura de los correos 
            from: from,
            to: destinatarios,
            subject: subject,
            html: htmlContent,
        });
        console.log("Correo enviado a:", destinatarios);   // verificacion del envio
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
}

module.exports = enviarCorreo;

