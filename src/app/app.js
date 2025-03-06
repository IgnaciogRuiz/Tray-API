'use strict'

var express = require('express');
var app = express();

// cargar archivos rutas
const authRoutes = require('../routes/auth');
const usuarioRoutes = require('../routes/usuarios');
const rolRoutes = require('../routes/rol')
const mesaRoutes = require('../routes/mesas');
const categoriaRoutes = require('../routes/categorias');
const productoRoutes = require('../routes/productos');
const menuRoutes = require('../routes/menus');
const pedidoRoutes = require('../routes/pedidos');
const detallePedidoRoutes = require('../routes/detallepedidos');


// middlewares
//var AuthMiddleware = require('../middlewares/authMiddleware')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuario',  usuarioRoutes);
app.use('/api/rol',  rolRoutes);
// app.use('/api/mesas', mesaRoutes);
// app.use('/api/categorias', categoriaRoutes);
// app.use('/api/productos', productoRoutes);
// app.use('/api/menus', menuRoutes);
// app.use('/api/pedidos', pedidoRoutes);
// app.use('/api/detalles-pedido', detallePedidoRoutes);

// exportar
module.exports = app;
