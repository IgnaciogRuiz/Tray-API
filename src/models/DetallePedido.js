const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./Pedido');
const Producto = require('./Producto');

const DetallePedido = sequelize.define('DetallePedido', {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pedido,
      key: 'id_pedido'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Producto,
      key: 'id_producto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'DetallePedido',
  timestamps: false
});

// Relaciones
Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido' });

Producto.hasMany(DetallePedido, { foreignKey: 'id_producto' });
DetallePedido.belongsTo(Producto, { foreignKey: 'id_producto' });

module.exports = DetallePedido;
