module.exports = (sequelize, Sequelize) => {
    const AuditoriaLogin = sequelize.define('AuditoriaLogin', {
        idAuditoria: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombreUsuario: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        exito : {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        fechaLogin: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        fechaLogout: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        token: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        direccionIp: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        agenteUsuario: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'AuditoriaLogin',
        timestamps: false
    });


    return AuditoriaLogin;
};
