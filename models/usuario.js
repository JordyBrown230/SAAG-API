module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('Usuario', {
      idUsuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombreUsuario: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
      },
      contrasena: {
        type: Sequelize.CHAR(64),
        allowNull: false
      },
      rol: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      idColaborador : {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true
      },
      refreshToken : {
        type: Sequelize.STRING,
        allowNull: true,
      }
    }, {
      tableName: 'Usuario',
      timestamps: false
    });

    //crea la restriccion de llave foranea en la bd
    Usuario.belongsTo(sequelize.models.Colaborador, {
      foreignKey: 'idColaborador',
      as: 'colaborador'
    });
    
    return Usuario;
};
