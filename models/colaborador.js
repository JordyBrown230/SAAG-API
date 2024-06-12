module.exports = (sequelize, Sequelize) => {
    const Colaborador = sequelize.define('Colaborador', {
        idColaborador: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        identificacion: { 
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        fotoCarnet: {
            type: Sequelize.BLOB('long'),
            allowNull: true
        },
        nombre: {
            type: Sequelize.STRING(150),
            allowNull: false
        },
        correoElectronico: {
            type: Sequelize.STRING(45),
            allowNull: false,
            unique: true
        },
        domicilio: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        fechaNacimiento: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        equipo: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        unidad: {
            type: Sequelize.STRING(250),
            allowNull: true
        },
        tipoJornada: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        estado: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        fechaIngreso: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        fechaSalida: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        idPuesto: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        idColaborador_fk: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'Colaborador',
        timestamps: false
    });

    Colaborador.belongsTo(sequelize.models.Puesto, {
        foreignKey: 'idPuesto',
        as: 'puesto'
    });
    
    Colaborador.belongsTo(sequelize.models.Colaborador, {
        foreignKey: 'idColaborador_fk',
        as: 'supervisor'
    });
    
    return Colaborador;
};

