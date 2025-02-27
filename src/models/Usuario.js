// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  DNI: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  email: {
    type:DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contraseña: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'empleado'),
    allowNull: false,
  },
  tokenRestaurante: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  tokenRecuperacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'Usuarios',
  timestamps: false,
});

module.exports = Usuario;
