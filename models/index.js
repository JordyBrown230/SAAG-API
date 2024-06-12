const Sequelize = require('sequelize');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME,DB_PORT
} = process.env;
console.log(DB_PORT)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port:DB_PORT,
  dialect: 'mysql',
  timezone: '-06:00',
  define: {
      freezeTableName: true
  },
  dialectOptions: {
     ssl: {
          require: true,
          rejectUnauthorized: false
      }
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.puesto = require('./puesto')(sequelize,Sequelize);
db.colaborador = require('./colaborador')(sequelize, Sequelize);
db.solicitud = require('./solicitud')(sequelize, Sequelize);
db.usuario = require('./usuario')(sequelize, Sequelize);
db.ausencia = require('./ausencia')(sequelize, Sequelize);
db.telefono = require('./telefonoEmpleado')(sequelize,Sequelize);
db.horasExtra = require('./horasExtra')(sequelize,Sequelize);
db.expediente = require('./expediente')(sequelize,Sequelize);
db.auditoria = require('./auditoria')(sequelize,Sequelize);
db.auditoriaLogin = require('./auditoriaLogin')(sequelize,Sequelize);
db.documento = require('./documento')(sequelize,Sequelize);

module.exports = db;
