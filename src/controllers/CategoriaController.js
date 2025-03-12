/*
Administra las categorías de productos.

Funciones:
    listarCategorias: Ver todas las categorías.
    crearCategoria: Agregar una nueva categoría.
    actualizarCategoria: Editar el nombre de una categoría.
    eliminarCategoria: Eliminar una categoría (si no tiene productos asignados).
*/

import { response } from 'express';
import CategoriaService from '../services/CategoriaService.js';

var CategoriaController = {
    test: async function(req,res) {
        return res.status(200).send({
            message: 'Categoria Controller Test'
          });
    },
    crearCategoria: async function (req, res) {
        const { nombre } = req.body || {};
        const { ID_Restaurante } = req.user;
        try {
            const response = await CategoriaService.crearCategoria({ nombre, ID_Restaurante});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en crearCategoria', error);
            res.status(400).json({ error: 'Error al crearCategoria', message: error.message });
        }
    },
    obtenerCategoria: async function (req, res) {
        const { id } = req.params || {};
        try {
            const response = await CategoriaService.obtenerCategoria({ id });
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en obtenerCategoria', error);
            res.status(400).json({ error: 'Error al obtenerCategoria', message: error.message });
        }
    },
    obtenerCategorias: async function (req, res) {
        const { ID_Restaurante } = req.user;
        try {
            const response = await CategoriaService.obtenerCategorias({ID_Restaurante});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en obtenerCategorias', error);
            res.status(400).json({ error: 'Error al obtenerCategorias', message: error.message });
        }
    },
    actualizarCategoria: async function (req, res) {
        const { id, nombre } = req.body || {};
        const { ID_Restaurante } = req.user;
        try {
            const response = await CategoriaService.actualizarCategoria({ id, nombre, ID_Restaurante});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en actualizarCategoria', error);
            res.status(400).json({ error: 'Error al actualizarCategoria', message: error.message });
        }
    },
    eliminarCategoria: async function (req, res) {
        const { id } = req.params || {};
        const { ID_Restaurante } = req.user;
        try {
            const response = await CategoriaService.eliminarCategoria({ id, ID_Restaurante });
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en eliminarCategoria', error);
            res.status(400).json({ error: 'Error al eliminarCategoria', message: error.message });
        }
    }
}

export default CategoriaController;