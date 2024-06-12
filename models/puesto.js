module.exports = (sequelize, Sequelize) => {
    const Puesto = sequelize.define('Puesto', {
        idPuesto: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombrePuesto: {
            type: Sequelize.STRING(80),
            allowNull: false
        },
    }, {
        tableName: 'Puesto',
        timestamps: false
    });
    return Puesto;
};
