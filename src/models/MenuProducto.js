// models/MenuProducto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Menu = require('./Menu');
const Producto = require('./Producto');

const MenuProducto = sequelize.define('MenuProducto', {
  id_menu: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menu,
      key: 'id_menu',
    },
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id_producto',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'MenuProductos',
  timestamps: false,
});

Menu.belongsToMany(Producto, {
  through: MenuProducto,
  foreignKey: 'id_menu',
});
Producto.belongsToMany(Menu, {
  through: MenuProducto,
  foreignKey: 'id_producto',
});

module.exports = MenuProducto;
