require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const {auditTables} = require('./middlewares/audit.middleware');
const emailController = require('./controllers/emails.controller');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Define las rutas del API
app.use('/saag', require('./routes/solicitud.routes'));
app.use('/saag', require('./routes/ausencia.routes'));
app.use('/saag', require('./routes/usuario.routes'));
app.use('/saag', require('./routes/colaborador.routes'));
app.use('/saag', require('./routes/horasExtra.routes'));
app.use('/saag', require('./routes/puesto.routes'));
app.use('/saag', require('./routes/auditoria.routes'));
app.use('/saag', require('./routes/auditoriaLogin.routes'));
app.use('/saag', require('./routes/expediente.routes'));
app.use('/saag', require('./routes/documento.routes'));
app.use('/saag', require('./routes/telefono.routes'));
app.use(auditTables);

app.use('/saag', require('./routes/login.routes'));

// Sincroniza la base de datos
db.sequelize.sync().then(() => {
  //*/5 * * * * *
  //'0 7 * * *'
  cron.schedule('0 7 * * *', ()=> {  //7AM
    emailController.notificarCumpleanios();
    emailController.documentosPorVencer();
  });

  app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });
});

module.exports = app;

