//importar services
const RolService = require('../services/RolService');
//importar archivos
const { response } = require('express');

var RolController = {
    test: function(req, res){
        return res.status(200).send({
          message: 'Test Controller Usuario'
        });
    },
    mostrarRols: async function (req, res) {
        const { ID_Restaurante } = req.user || {};
        try {
            const response = await RolService.obtenerRoles({ID_Restaurante});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en crearRol', error);
            res.status(400).json({ error: 'Error al crearRol', message: error.message });
        }  
    },
    crearRol: async function (req, res) {
        const { ID_Restaurante } = req.user || {};
        const { nombre, descripcion } = req.body || {};
        try {
            const response = await RolService.CrearRol({ID_Restaurante, nombre, descripcion});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en crearRol', error);
            res.status(400).json({ error: 'Error al crearRol', message: error.message });
        }
    },
    actualizarRol: async function (req, res) {
        const { ID_Restaurante } = req.user || {};
        const { ID, nombre, descripcion } = req.body || {};
        try {
            const response = await RolService.actualizarRol({ID_Restaurante, ID, nombre, descripcion});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en crearRol', error);
            res.status(400).json({ error: 'Error al crearRol', message: error.message });
        }
    },
    eliminarRol: async function (req, res) {
        const { ID } = req.body || {};
        try {
            const response = await RolService.eliminarRol({ID});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en crearRol', error);
            res.status(400).json({ error: 'Error al crearRol', message: error.message });
        }
    },
}

module.exports =  RolController 