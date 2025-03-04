var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/AuthController');
var AuthMiddleware = require('../middlewares/authMiddleware');


//GET
router.get('/test', AuthController.test);
//POST
router.post('/register/admin', AuthController.CreateAdmin);
router.post('/register/empleado', AuthController.CreateEmpleado);
router.post('/login', AuthController.Login);
router.post('/login/select', AuthMiddleware, AuthController.Select);
router.post('/solicitar-recuperacion', AuthController.solicitarRecuperacion);
router.post('/verificar-token', AuthController.verificarTokenRecuperacion);
router.post('/vincular', AuthMiddleware, AuthController.verificarTokenRecuperacion);

//PATCH
router.patch('/actualizar-password', AuthController.actualizarContrasena);

module.exports = router;   