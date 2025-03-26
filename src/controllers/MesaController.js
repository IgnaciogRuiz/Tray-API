/*
Administra el estado de las mesas.
Funciones:
    listarMesas: Ver todas las mesas con su estado actual (Disponible/Ocupada).
    cambiarEstadoMesa: Actualizar el estado de una mesa.
    crearMesa: Agregar una nueva mesa.
    eliminarMesa: Eliminar o desactivar una mesa (según necesidad).
*/ 

import MesaService from "../services/MesaService.js";

var MesaController = {
    test: async function(req,res) {
        res.status(200).json({message:'mesaController Test'}); 
    },
    crearMesa: async function(req,res) {
        const { numero_mesa } = req.body || {};
        const { ID_Restaurante } = req.user;
        try {
            const response = await MesaService.CrearMesa({ID_Restaurante, numero_mesa});
            res.status(200).json({ response }); 
        } catch (error) {
            res.status(400).json({ error: 'Error al crearMesa', message: error.message });
        }
    },
    obtenerMesa: async function(req,res) {
        const { id } = req.params || {};
        const { ID_Restaurante } = req.user;
        try {
            const response = await MesaService.obtenerMesa({ID_Restaurante, id});
            res.status(200).json({ response }); 
        } catch (error) {
            res.status(400).json({ error: 'Error al obtenerMesa', message: error.message });
        }
    },
    obtenerMesas: async function(req,res) {
        const { ID_Restaurante } = req.user;
        try {
            const response = await MesaService.obtenerMesas({ID_Restaurante});
            res.status(200).json({ response }); 
        } catch (error) {
            res.status(400).json({ error: 'Error al obtenerMesas', message: error.message });
        }
    },
    actualizarMesa: async function(req,res) {
        const { ID_Restaurante } = req.user;
        const { id, numero_mesa, estado, activo} = req.body || {};
        try {
            const response = await MesaService.actualizarMesas({ID_Restaurante, id, numero_mesa, estado, activo});
            res.status(200).json({ response }); 
        } catch (error) {
            res.status(400).json({ error: 'Error al actualizarMesa', message: error.message });
        }
    },
    eliminarMesa: async function(req,res) {
        const { ID_Restaurante } = req.user;
        const { id } = req.params || {};
        try {
            const response = await MesaService.eliminarMesas({ID_Restaurante, id });
            res.status(200).json({ response }); 
        } catch (error) {
            res.status(400).json({ error: 'Error al eliminarMesa', message: error.message });
        }
    }
}

export default MesaController;