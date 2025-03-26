// /routes/categorias
import express from 'express';
import PedidoController from '../controllers/PedidoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

var router = express.Router();

//GET
router.get('/test', AuthMiddleware, PedidoController.test)
router.get('/all', AuthMiddleware, PedidoController.obtenerPedidos)
router.get('/:id', AuthMiddleware, PedidoController.obtenerPedido)

//POST
router.post('/create', AuthMiddleware, PedidoController.crearPedido)

//PATCH
router.put('/update', AuthMiddleware, PedidoController.actualizarPedido)

//DELETE
router.delete('/delete/:id', AuthMiddleware, PedidoController.eliminarPedido)


export default router;    