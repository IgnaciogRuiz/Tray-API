/*
Administra las categorías de productos.

Funciones:
    listarCategorias: Ver todas las categorías.
    crearCategoria: Agregar una nueva categoría.
    actualizarCategoria: Editar el nombre de una categoría.
    eliminarCategoria: Eliminar una categoría (si no tiene productos asignados).
*/

//importar services
const CategoriaService = require('../services/CategoriaService');
//importar archivos
const { response } = require('express');

var CategoriaController = {
    test: async function(req,res) {
        return res.status(200).send({
            message: 'Categoria Controller Test'
          });
    },
    crearCategoria: async function (req, res) {
        const { nombre } = req.body || {};
        try {
            const response = await CategoriaService.crearCategoria({ nombre });
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
        try {
            const response = await CategoriaService.obtenerCategorias({});
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en obtenerCategorias', error);
            res.status(400).json({ error: 'Error al obtenerCategorias', message: error.message });
        }
    },
    actualizarCategoria: async function (req, res) {
        const { ID, nombre } = req.body || {};
        try {
            const response = await CategoriaService.actualizarCategoria({ ID, nombre });
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en actualizarCategoria', error);
            res.status(400).json({ error: 'Error al actualizarCategoria', message: error.message });
        }
    },
    eliminarCategoria: async function (req, res) {
        const { id } = req.params || {};
        try {
            const response = await CategoriaService.eliminarCategoria({ id });
            res.status(200).json({ response }); 
        } catch (error) {
            //console.error('Error en eliminarCategoria', error);
            res.status(400).json({ error: 'Error al eliminarCategoria', message: error.message });
        }
    }
}

module.exports = CategoriaController