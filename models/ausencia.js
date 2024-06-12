module.exports = (sequelize, Sequelize) => {
    const Ausencia = sequelize.define('Ausencia', {
        idAusencia: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fechaAusencia: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        fechaFin: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        razon: {
            type: Sequelize.STRING(250),
            allowNull: true
        },
        nombreColaborador: {
            type: Sequelize.STRING(45),
            allowNull: false,
          },
        idColaborador: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Ausencia',
        timestamps: false
    });
    //crea la restriccion de llave foranea en la bd
    Ausencia.belongsTo(sequelize.models.Colaborador, {
        foreignKey: 'idColaborador',
        as: 'colaborador'
    });

    return Ausencia;
};
