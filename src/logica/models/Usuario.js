'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuario.belongsTo(models.Ciudad, {
        foreignKey: 'id',
        targetKey: 'Id_Admin'
      })
      Usuario.belongsTo(models.Usuario_Dispositivo, {
        foreignKey: 'id',
        targetKey: 'Id_Usuario'
      })
    }
  }
  Usuario.init({
    Nombre: DataTypes.STRING,
    Contrasena: DataTypes.STRING,
    Correo: DataTypes.STRING,
    EsAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Usuario',
    timestamps: false,
    freezeTableName: true,
  });
  return Usuario;
};