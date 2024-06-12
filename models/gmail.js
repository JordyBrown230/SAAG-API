const {createTransport} = require('nodemailer');
require('dotenv').config();
// datos necesariso para el uso del correo que esta asignado como el que los envia
const { GM_MAIL, GM_PASS, GM_HOSTED, GM_PORTMAIL } = process.env;

const transporter = createTransport({
    host: GM_HOSTED,
    port: GM_PORTMAIL,
    secure: true,
    auth: {
        user: GM_MAIL,
        pass: GM_PASS,
    },
});

module.exports = transporter;