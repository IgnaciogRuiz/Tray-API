//Rutas de Rol
var express = require('express');
var CategoriaController = require('../controllers/CategoriaController');
var router = express.Router();
var AuthMiddleware = require('../middlewares/authMiddleware');


//GET
router.get('/test', AuthMiddleware, CategoriaController.test)
router.get('/all', AuthMiddleware, CategoriaController.obtenerCategorias)
router.get('/:id', AuthMiddleware, CategoriaController.obtenerCategoria)

//POST
router.post('/create', AuthMiddleware, CategoriaController.crearCategoria)

//PATCH
router.patch('/update', AuthMiddleware, CategoriaController.actualizarCategoria)

//DELETE
router.delete('/delete/:id', AuthMiddleware, CategoriaController.eliminarCategoria)


module.exports = router;    