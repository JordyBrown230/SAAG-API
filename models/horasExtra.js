module.exports = (sequelize, Sequelize) => {
    const HorasExtras = sequelize.define('HorasExtras', {
        idHorasExtras: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        fechaHorasExtras: {
            type: Sequelize.DATE,
            allowNull: false
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rangoHoras: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        idColaborador: {
            type:Sequelize.INTEGER,
            allowNull:false,
        }
    }, {
        tableName: 'HorasExtras',
        timestamps: false
    });

    HorasExtras.belongsTo(sequelize.models.Colaborador, {
        foreignKey: 'idColaborador',
        as: 'colaborador'
    });

    return HorasExtras;
};
