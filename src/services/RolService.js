const { Rol } = require('../database/schema');
const { Op } = require('sequelize');

const obtenerRoles = async ({ID_Restaurante}) => {
    try {
        const roles = await Rol.findAll({
            where: {
                [Op.or]: [
                    { restaurante_id: ID_Restaurante }, // Roles del restaurante
                    { restaurante_id: null }            // Roles globales
                ]
            }
        });
        
        // Si no hay roles, lanzar un error
        if (roles.length === 0) {
            throw new Error('No hay roles disponibles para este restaurante');
        }
        
        // Retornar los roles formateados
        return {
            roles: roles.map(rol => ({
                id: rol.id,
                nombre: rol.nombre,
                descripcion: rol.descripcion
            }))
        };

    } catch (error) {
        throw error; 
    }
}

const obtenerRol = async ({id}) => {
    try {
        const rol = await Rol.findOne({
            where: {
                ID: id
            }
        });
        
        // Si no hay roles, lanzar un error
        if (!rol) {
            throw new Error('No existe un rol con esa ID');
        }
        
        // Retornar los roles formateados
        return {
            rol: {
                id: rol.id,
                nombre: rol.nombre,
                descripcion: rol.descripcion
            }
        };

    } catch (error) {
        throw error; 
    }
}

const CrearRol = async ({ID_Restaurante, nombre, descripcion}) => {
    try {
         if (!ID_Restaurante) throw new Error('no existe ID_restaurante en el token');
        if (!nombre) throw new Error('nombre no proporcionado');
        if (!descripcion) throw new Error('descripcion no proporcionado');

        const nuevoRol = await Rol.create({
            ID: null,
            nombre,
            descripcion,
            restaurante_id: ID_Restaurante
        })      
        if (nuevoRol) {
            const mensaje = "Rol " + nombre + " creado con exito"
            return {message: mensaje}
        }
    } catch (error) {
        throw error; 
    }
}

const actualizarRol = async ({ID_Restaurante, ID, nombre, descripcion}) => {
    try {
        if (!ID_Restaurante) throw new Error('no existe ID_restaurante en el token');
        if (!ID) throw new Error('ID no proporcionado');
        if (!nombre) throw new Error('nombre no proporcionado');
        if (!descripcion) throw new Error('descripcion no proporcionado');

        const ModificarRol = await Rol.findOne({
            where: {ID: ID}
        })
        if (!ModificarRol) {
            throw new Error('no existe un rol con esa ID');
        }
        
        ModificarRol.nombre = nombre
        ModificarRol.descripcion = descripcion
         // Guardar los cambios
        await ModificarRol.save();
        return {
            message: 'Datos de rol modificados con exito',
            nombre: nombre,
            descripcion: descripcion
        }

    } catch (error) {
        throw error; 
    }
}

const eliminarRol = async ({id}) => {
    try {
        if (!id) throw new Error('ID no proporcionado');

        const EliminarRol = await Rol.destroy({
            where: {ID: id}
        })
        if (!EliminarRol ) {
            throw new Error('no existe un rol con esa ID');
        }
        var mensaje = "Rol " + nombre + " eliminado con exito"
        return { 
            message: mensaje
        }

    } catch (error) {
        throw error; 
    }
}

// const MiFuncion = async ({params}) => {
//     try {
        
//     } catch (error) {
//         throw error; 
//     }
// }

module.exports = {obtenerRoles, obtenerRol, CrearRol, actualizarRol, eliminarRol}