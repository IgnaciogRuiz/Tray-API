// /routes/categorias
import express from 'express';
import CategoriaController from '../controllers/CategoriaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

var router = express.Router();

//GET
router.get('/test', AuthMiddleware, CategoriaController.test)
router.get('/all', AuthMiddleware, CategoriaController.obtenerCategorias)
router.get('/:id', AuthMiddleware, CategoriaController.obtenerCategoria)

//POST
router.post('/create', AuthMiddleware, CategoriaController.crearCategoria)

//PATCH
router.put('/update', AuthMiddleware, CategoriaController.actualizarCategoria)

//DELETE
router.delete('/delete/:id', AuthMiddleware, CategoriaController.eliminarCategoria)


export default router;    