module.exports = (sequelize, Sequelize) => {
  const Solicitud = sequelize.define(
    "Solicitud",
    {
      idSolicitud: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      conGoceSalarial: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      tipoSolicitud: {
        //vacaciones o licencia
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      asunto: {
        type: Sequelize.STRING(45),
        allowNull: true, //comentario de parte del colaborador
      },
      nombreColaborador: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      nombreEncargado: {
        type: Sequelize.STRING(45), //encargado de revisar solicitud
        allowNull: true,
      },
      fechaSolicitud: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fechaInicio: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fechaFin: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      horaInicio: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      horaFin: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      sustitucion: {
        //se requiere o no? SI/NO
        type: Sequelize.STRING(4),
        allowNull: true,
      },
      nombreSustituto: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      comentarioTalentoHumano: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      fechaRecibido: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      idColaborador: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nombreArchivo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      comprobante: {
        type: Sequelize.BLOB("long"),
        allowNull: true,
      },
      tamanio: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "Solicitud",
      timestamps: false,
    }
  );

  Solicitud.belongsTo(sequelize.models.Colaborador, {
    foreignKey: "idColaborador",
    as: "colaborador",
  });

  return Solicitud;
};