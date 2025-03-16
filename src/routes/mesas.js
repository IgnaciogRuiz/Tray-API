// /routes/categorias
import express from 'express';
import MesaController from '../controllers/MesaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

var router = express.Router();

//GET
router.get('/test', AuthMiddleware, MesaController.test)
router.get('/all', AuthMiddleware, MesaController.obtenerMesas)
router.get('/:id', AuthMiddleware, MesaController.obtenerMesa)

//POST
router.post('/create', AuthMiddleware, MesaController.crearMesa)

//PATCH
router.patch('/update', AuthMiddleware, MesaController.actualizarMesa)

//DELETE
router.delete('/delete/:id', AuthMiddleware, MesaController.eliminarMesa)


export default router;    