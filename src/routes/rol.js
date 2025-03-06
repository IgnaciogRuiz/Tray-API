//Rutas de Rol
var express = require('express');
var RolController = require('../controllers/RolController');
var router = express.Router();
var AuthMiddleware = require('../middlewares/authMiddleware');


//GET
router.get('/test', AuthMiddleware, RolController.test)
router.get('/all', AuthMiddleware, RolController.mostrarRols)

//POST
router.post('/create', AuthMiddleware, RolController.crearRol)

//PATCH
router.patch('/update', AuthMiddleware, RolController.actualizarRol)

//DELETE
router.delete('/delete', AuthMiddleware, RolController.eliminarRol)


module.exports = router;    