'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario_Dispositivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuario_Dispositivo.belongsTo(models.Ciudad, {
        foreignKey: 'Id_Admin',
        targetKey: 'id'
      })
    }
  }
  Usuario_Dispositivo.init({
    Id_Usuario: DataTypes.INTEGER,
    Id_Dispositivo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Usuario_Dispositivo',
    timestamps: false,
    freezeTableName: true,
  });
  Usuario_Dispositivo.removeAttribute('id')
  return Usuario_Dispositivo;
};