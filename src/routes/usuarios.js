import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

var router = express.Router();


//GET
router.get('/test', AuthMiddleware, UsuarioController.test);
router.get('/', AuthMiddleware, UsuarioController.obtenerUsuario);
router.get('/all', AuthMiddleware, UsuarioController.obtenerEmpleados);

//PATCH
router.patch('/cambiar-password', AuthMiddleware, UsuarioController.actualizarPassword);
router.patch('/actualizar', AuthMiddleware, UsuarioController.actualizarUsuario);

//DELETE
router.delete('/eliminar', AuthMiddleware, UsuarioController.eliminarUsuariodeRestaurante);



export default  router;    