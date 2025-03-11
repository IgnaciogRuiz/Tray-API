import express from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

//GET
router.get('/test', AuthController.test);
//POST
router.post('/register/admin', AuthController.CreateAdmin);
router.post('/register/empleado', AuthController.CreateEmpleado);
router.post('/login', AuthController.Login);
router.post('/login/select', authMiddleware, AuthController.Select);
router.post('/solicitar-recuperacion', AuthController.solicitarRecuperacion);
router.post('/verificar-token', AuthController.verificarTokenRecuperacion);
router.post('/vincular', authMiddleware, AuthController.verificarTokenRecuperacion);

//PATCH
router.patch('/actualizar-password', AuthController.actualizarContrasena);

export default router;   