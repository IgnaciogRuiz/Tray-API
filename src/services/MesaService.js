import { Mesa } from '../database/models.js';
import { Op } from 'sequelize';

const CrearMesa = async ({ID_Restaurante, numero_mesa }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        if (!numero_mesa) throw new Error('numero_mesa no proporcionado');

        const mesaExistente = await Mesa.findOne({ where: { restaurante_id: ID_Restaurante, numero_mesa } });
        if (mesaExistente) throw new Error('La mesa ya existe en este restaurante');

        const nuevaMesa = await Mesa.create({ restaurante_id: ID_Restaurante, numero_mesa, estado: 'libre', activo: true });
        return nuevaMesa;
    } catch (error) {
        throw error;
    }
};

const obtenerMesa = async ({ID_Restaurante, id }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        const mesa = await Mesa.findOne({where: {id_mesa: id, restaurante_id: ID_Restaurante}});
        if (!mesa) throw new Error('no existe una mesa con esa ID');
        return mesa;
    } catch (error) {
        throw error;
    }
};

const obtenerMesas = async ({ ID_Restaurante }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        const mesas = await Mesa.findAll({ where: { restaurante_id: ID_Restaurante, activo: true  } });
        return mesas;
    } catch (error) {
        throw error;
    }
};

const actualizarMesas = async ({ ID_Restaurante, id, numero_mesa, estado, activo }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        if (!id) throw new Error('id no proporcionado');
        const mesa = await Mesa.findOne({where: {id_mesa: id, restaurante_id: ID_Restaurante}});
        if (!mesa) throw new Error('No existe una mesa con esa ID');
        await mesa.update({
            numero_mesa,
            estado,
            activo
        });
        return mesa;
    } catch (error) {
        throw error;
    }
};

const eliminarMesas = async ({ ID_Restaurante, id }) => {
    try {
        if (!ID_Restaurante) throw new Error('restaurante_id no existe en el token');
        if (!id) throw new Error('id no proporcionado');
        const mesa = await Mesa.findOne({where: {id_mesa: id, restaurante_id: ID_Restaurante}});
        if (!mesa) throw new Error('No existe una mesa con esa ID');

        await mesa.update({ activo: false });
        return { message: 'Mesa eliminada correctamente' };
    } catch (error) {
        throw error;
    }
};


export default {CrearMesa, obtenerMesa, obtenerMesas, actualizarMesas, eliminarMesas};