'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dispositivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dispositivo.hasMany(models.Ciudad,{
        foreignKey: 'id'
      })
      Dispositivo.belongsTo(models.Medida, {
        foreignKey: 'Id_Dispositivo',
        targetKey: 'id'
      })
      Dispositivo.belongsTo(models.Usuario_Dispositivo, {
        foreignKey: 'Id_Dispositivo',
        targetKey: 'id'
      })
    }
  }
  Dispositivo.init({
    Nombre: DataTypes.STRING,
    Id_Ciudad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Dispositivo',
    timestamps: false,
    freezeTableName: true,
  });
  return Dispositivo;
};