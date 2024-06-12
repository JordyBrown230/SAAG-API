
module.exports = (sequelize,Sequelize) => {
    const Documento = sequelize.define('Documento', {
        idDocumento:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        licencia: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        curso: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        nombreArchivo: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        archivo: {
            type: Sequelize.BLOB('long'),
            allowNull: false
        },
        tamano: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        fechaVencimiento:{
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        fechaSubida: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        idColaborador: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    },{
        tableName: 'Documento',
        timestamps: false
    });
    Documento.belongsTo(sequelize.models.Colaborador, {
        foreignKey: 'idColaborador',
        as: 'colaborador'
    });

    return Documento;
};

