import { Producto, CategoriaProducto } from '../database/models.js';
import { Op } from 'sequelize';

const crearProducto = async ({ ID_Restaurante, nombre, precio, categoria_id }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        if (!nombre) throw new Error('Nombre del producto no proporcionado');
        if (!precio) throw new Error('Precio del producto no proporcionado');

        const productoExistente = await Producto.findOne({ where: { nombre, restaurante_id: ID_Restaurante } });
        if (productoExistente) throw new Error('El producto ya existe en este restaurante');

        const nuevoProducto = await Producto.create({ restaurante_id: ID_Restaurante, nombre, precio, activo: true });
        
        if (categoria_id) {
            await CategoriaProducto.create({ producto_id: nuevoProducto.id_producto, categoria_id });
        }

        return nuevoProducto;
    } catch (error) {
        throw error;
    }
};

const obtenerProducto = async ({ ID_Restaurante, id_producto }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        if (!id_producto) throw new Error('ID del producto no proporcionado');
        const producto = await Producto.findOne({ 
            where: { id_producto, restaurante_id: ID_Restaurante },
            include: [{ model: CategoriaProducto, attributes: ['categoria_id'] }]
        });
        if (!producto) throw new Error('Producto no encontrado');
        return producto;
    } catch (error) {
        throw error;
    }
};

const obtenerProductos = async ({ ID_Restaurante }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        const productos = await Producto.findAll({ 
            where: { restaurante_id: ID_Restaurante, activo: true },
            include: [{ model: CategoriaProducto, attributes: ['categoria_id'] }]
        });
        return productos;
    } catch (error) {
        throw error;
    }
};

const actualizarProducto = async ({ ID_Restaurante, id_producto, nombre, precio, categoria_id }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        if (!id_producto) throw new Error('ID del producto no proporcionado');
        const producto = await Producto.findOne({ where: { id_producto, restaurante_id: ID_Restaurante } });
        if (!producto) throw new Error('Producto no encontrado');

        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (precio !== undefined) datosActualizados.precio = precio;

        await producto.update(datosActualizados);
        
        if (categoria_id) {
            await CategoriaProducto.destroy({ where: { producto_id: id_producto } });
            await CategoriaProducto.create({ producto_id: id_producto, categoria_id });
        }

        return producto;
    } catch (error) {
        throw error;
    }
};

const eliminarProducto = async ({ ID_Restaurante, id_producto }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        if (!id_producto) throw new Error('ID del producto no proporcionado');
        const producto = await Producto.findOne({ where: { id_producto, restaurante_id: ID_Restaurante } });
        if (!producto) throw new Error('Producto no encontrado');
        await producto.update({ activo: false });
        return { message: 'Producto eliminado correctamente' };
    } catch (error) {
        throw error;
    }
};

export default { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto };