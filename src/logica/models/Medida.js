'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medida.hasMany(models.Usuario,{
        foreignKey: 'id'
      })
    }
  }
  Medida.init({
    Dato: DataTypes.INTEGER,
    Fecha: DataTypes.INTEGER,
    Latitud: DataTypes.INTEGER,
    Longitud: DataTypes.INTEGER,
    Id_Dispositivo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Medida',
    timestamps: false,
    freezeTableName: true,
  });
  return Medida;
};