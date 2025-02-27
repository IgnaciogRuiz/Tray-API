//Rutas de Usuario
var express = require('express');
var UsuarioController = require('../controllers/UsuarioController');
var router = express.Router();
var AuthMiddleware = require('../middlewares/auth');



//GET
router.get('/test', AuthMiddleware, UsuarioController.test);
router.get('/', AuthMiddleware, UsuarioController.obtenerUsuario);
router.get('/all', AuthMiddleware, UsuarioController.obtenerEmpleados);
//router.get('/ver-token', authMiddleware, UsuarioController);
//POST
router.post('/register/admin', UsuarioController.CreateAdmin);
router.post('/register/empleado', UsuarioController.CreateEmpleado);
router.post('/login', UsuarioController.login);
router.post('/solicitar-recuperacion', UsuarioController.solicitarRecuperacion);
router.post('/verificar-token', UsuarioController.verificarTokenRecuperacion);
router.post('/actualizar-password', UsuarioController.actualizarContrasena);
//PUT
 router.put('/actualizar-usuario', AuthMiddleware, UsuarioController.actualizarUsuario)
//DELETE




module.exports = router;    