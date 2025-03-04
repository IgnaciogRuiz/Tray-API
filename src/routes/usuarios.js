//Rutas de Usuario
var express = require('express');
var UsuarioController = require('../controllers/UsuarioController');
var router = express.Router();
var AuthMiddleware = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');



//GET
router.get('/test', AuthMiddleware, UsuarioController.test);
router.get('/', AuthMiddleware, UsuarioController.obtenerUsuario);
router.get('/all', AuthMiddleware, UsuarioController.obtenerEmpleados);

//PATCH
router.patch('/cambiar-password', AuthMiddleware, UsuarioController.actualizarPassword);
router.patch('/actualizar', AuthMiddleware, UsuarioController.actualizarUsuario);

//DELETE
router.delete('/eliminar', authMiddleware, UsuarioController.eliminarUsuariodeRestaurante);



module.exports = router;    