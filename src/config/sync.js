// sync.js
const sequelize = require('./database');
const Usuario = require('../models/Usuario');
const Mesa = require('../models/Mesa');
const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');
const Menu = require('../models/Menu');
const MenuProducto = require('../models/MenuProducto');
const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos:', error);
  });