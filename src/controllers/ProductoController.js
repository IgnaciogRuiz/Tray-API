/*
Gestiona los productos individuales.
Funciones:
    listarProductos: Ver todos los productos.
    crearProducto: Agregar un nuevo producto (solo admin).
    actualizarProducto: Editar un producto existente.
    eliminarProducto: Eliminar o desactivar un producto.
*/

import ProductoService from "../services/ProductoService.js";
//cambiar la manera en que se pasan los parametros
var ProductoController = {
    test: async (req, res) => {
        res.send("API de Productos funcionando correctamente");
    },
    crearProducto: async (req, res) => {
        try {
            const { ID_Restaurante } = req.user;
            const producto = await ProductoService.CrearProducto({ ID_Restaurante, ...req.body });
            res.status(201).json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    obtenerProductos: async (req, res) => {
        try {
            const { ID_Restaurante } = req.user;
            const productos = await ProductoService.obtenerProductos({ ID_Restaurante });
            res.status(200).json(productos);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    obtenerProducto: async (req, res) => {
        try {
            const { ID_Restaurante } = req.user;
            const { id } = req.params;
            const producto = await ProductoService.obtenerProducto({ ID_Restaurante, id_producto: id });
            res.status(200).json(producto);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    actualizarProducto: async (req, res) => {
        try {
            const { ID_Restaurante } = req.user;
            const { id } = req.params;
            const producto = await ProductoService.actualizarProducto({ ID_Restaurante, id_producto: id, ...req.body });
            res.status(200).json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    eliminarProducto: async (req, res) => {
        try {
            const { ID_Restaurante } = req.user;
            const { id } = req.params;
            const resultado = await ProductoService.eliminarProducto({ ID_Restaurante, id_producto: id });
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

export default ProductoController;
