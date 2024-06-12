module.exports = (sequelize,Sequelize) => {
    const TelefonoEmpleado = sequelize.define('TelefonoEmpleado', {
        idTelefono: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        numeroTelefono: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        idColaborador: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    },{
        tableName: 'TelefonoEmpleado',
        timestamps: false
    });

    TelefonoEmpleado.belongsTo(sequelize.models.Colaborador, {
        foreignKey: 'idColaborador',
        as: 'colaborador'
    });
    
    return TelefonoEmpleado;
};