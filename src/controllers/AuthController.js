/*
Gestiona todo lo relacionado con la autenticacion de incio de sesion, registro y recuperacion de contraseña.
Funciones:
    crearUsuario: Registrar nuevos usuarios, Admin y Empleados.
    iniciarSesion: Autenticación y generación de token (si usas JWT).
    resetPassword: solicitar la recuperacion de contraseña.
 */

const { response } = require('express');
const AuthService = require('../services/AuthService');

var AuthController = {
    test: function(req, res){
        return res.status(200).send({
          message: 'Auth Controller Test'
        });
      },
    CreateAdmin: async function(req, res) {
        const { DNI, nombre, apellido, password, repPassword, email, nombreRestaurante, telefono, cobra_cubiertos, precio_cubiertos, idPlan, calleDomicilio, numeroDomicilio, cp, localidad } = req.body || {};
        try {
            //llamar al servicio crearAdmin
            const response = await AuthService.crearAdmin({ DNI, nombre, apellido, password, repPassword, email, nombreRestaurante, telefono, cobra_cubiertos, precio_cubiertos, idPlan, calleDomicilio, numeroDomicilio, cp, localidad });
    
            //respuesta
            res.status(201).json({response});
        } catch (error) {
            //console.error("Error en CreateAdmin:", error);
            res.status(400).json({ error: 'Error al registrar dueño', message: error.message });
        }
    },
    CreateEmpleado: async function(req, res) { 
        const { DNI, nombre, apellido, password, repPassword, tokenRestaurante, email } = req.body || {};
        try {
            // llamar a la funcion crear empleado
            const response = await AuthService.crearEmpleado({ DNI, nombre, apellido, password, repPassword, tokenRestaurante, email });

            //respuesta
            res.status(201).json({ message: 'Empleado registrado con éxito' });
        } catch (error) {
            console.error("Error en CreateEmpleado: ",error);
            res.status(400).json({ error: 'Error al registrar empleado', message: error.message });
        }
    },
    Login: async function(req, res) {
        const { DNI, password } = req.body || {};

        try {
            // llamar a la funcion crear empleado
            const response = await AuthService.login({  DNI, password  });

            //respuesta
            return res.status(201).json({ response });
        } catch (error) {
            //console.error("Error en Login: ",error);
            res.status(400).json({ error: 'Error al iniciar sesion', message: error.message });
        }
    },
    Select: async function (req, res) {
        const { Restaurante_ID } = req.body || {}; //ID del restaurante desde el body
        const { DNI } = req.user || {}; //DNI desde el JWT (middleware)
        
        try {
            const response = await AuthService.select({ DNI, Restaurante_ID });
            res.status(200).json({ response });
        } catch (error) {
            res.status(400).json({ error: 'Error al seleccionar restaurante', message: error.message });
        }
    },
    VincularRestauramte: async function (req, res) {
        const { DNI } = req.user || {}; 
        try {
            const response = await AuthService.vincular({DNI});
            res.status(200).json({ response });
        } catch (error) {
            res.status(400).json({ error: 'Error al seleccionar restaurante', message: error.message });
        }
    },
    solicitarRecuperacion: async (req, res) => {
        const { email } = req.body || {};

        try {
            const response = await AuthService.solicitarRecuperacion({email});
            res.status(200).json({ response });
        } catch (error) {
            //console.error('Error en solicitarRecuperacion', error);
            res.status(400).json({ error: 'Error al solicitar codigo de recuperacion',  message: error.message });
        }
    },
    verificarTokenRecuperacion: async (req, res) => {
        const { email, tokenRecuperacion } = req.body || {};
        try {
            const response = await AuthService.verificarToken({email, tokenRecuperacion});           
            res.status(200).json({ response });
        } catch (error) {
            //console.error('Error en verificarTokenRecuperacion', error);
            res.status(400).json({ error: 'Error al verificar codigo de recuperacion',  message: error.message });
        }
    },
    actualizarContrasena: async (req, res) => {
        const { email, tokenRecuperacion, nuevaPassword, repPassword } = req.body || {};
    
        try {
            const response = await AuthService.cambiarPassword({email, tokenRecuperacion, nuevaPassword, repPassword});           
            res.status(200).json({ response });
            
        } catch (error) {
            //console.error('Error en actualizarContrasena', error);
            res.status(400).json({ error: 'Error al cambiar contraseña', message: error.message });
        }
    },
}

module.exports = AuthController;