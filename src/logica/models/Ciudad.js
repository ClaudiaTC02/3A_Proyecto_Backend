'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ciudad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ciudad.hasMany(models.Usuario,{
        foreignKey: 'id'
      })
      Ciudad.belongsTo(models.Dispositivo, {
        foreignKey: 'id',
        targetKey: 'Id_Ciudad'
      })
    }
  }
  Ciudad.init({
    Nombre: DataTypes.STRING,
    Id_Admin: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Ciudad',
    timestamps: false,
    freezeTableName: true,
  });
  return Ciudad;
};