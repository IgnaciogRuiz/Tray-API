// models/Mesa.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mesa = sequelize.define('Mesa', {
  id_mesa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numero_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  estado: {
    type: DataTypes.ENUM('Disponible', 'Ocupada'),
    allowNull: false,
  }
}, {
  tableName: 'Mesas',
  timestamps: false,
});

module.exports = Mesa;
