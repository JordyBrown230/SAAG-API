module.exports = (sequelize, Sequelize) => {
    const Auditoria = sequelize.define('Auditoria', {
        idAuditoria: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idUsuario: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        nombreUsuario: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        rol: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        accion: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        nombre : {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        datosAntiguos : {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        datosNuevos : {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        fecha: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        direccionIp: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        agenteUsuario: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
    }, {
        tableName: 'Auditoria',
        timestamps: false
    });


    return Auditoria;
};
