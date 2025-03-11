import express from 'express';
var app = express();

// cargar archivos rutas
import authRoutes from '../routes/auth.js';
import usuarioRoutes from '../routes/usuarios.js';
import categoriaRoutes from '../routes/categorias.js';



// middlewares
import authMiddleware from '../middlewares/authMiddleware.js';
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
// app.use('/api/mesas', mesaRoutes);
app.use('/api/categoria', categoriaRoutes);
// app.use('/api/productos', productoRoutes);
// app.use('/api/menus', menuRoutes);
// app.use('/api/pedidos', pedidoRoutes);
// app.use('/api/detalles-pedido', detallePedidoRoutes);

// exportar
export default app;
