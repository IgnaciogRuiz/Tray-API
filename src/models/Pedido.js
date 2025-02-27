// models/Pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Mesa = require('./Mesa');
const Usuario = require('./Usuario');

const Pedido = sequelize.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Mesa,
      key: 'id_mesa',
    },
  },
  DNI: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'DNI',
    },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Completo', 'Cancelado'),
    allowNull: false,
  },
  delivery: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  tableName: 'Pedidos',
  timestamps: false,
});

Mesa.hasMany(Pedido, { foreignKey: 'id_mesa' });
Usuario.hasMany(Pedido, { foreignKey: 'DNI' });
Pedido.belongsTo(Mesa, { foreignKey: 'id_mesa' });
Pedido.belongsTo(Usuario, { foreignKey: 'DNI' });

module.exports = Pedido;
