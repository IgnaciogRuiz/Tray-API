// /routes/productos
import express from 'express';
import ProductoController from '../controllers/ProductoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

var router = express.Router();

//GET
router.get('/test', AuthMiddleware, ProductoController.test)
router.get('/all', AuthMiddleware, ProductoController.obtenerProductos)
router.get('/:id', AuthMiddleware, ProductoController.obtenerProducto)

//POST
router.post('/create', AuthMiddleware, ProductoController.crearProducto)

//PATCH
router.put('/update', AuthMiddleware, ProductoController.actualizarProducto)

//DELETE
router.delete('/delete/:id', AuthMiddleware, ProductoController.eliminarProducto)


export default router;    