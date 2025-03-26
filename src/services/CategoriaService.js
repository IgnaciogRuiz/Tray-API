import { Categoria } from '../database/models.js';
import { Op } from 'sequelize';


const crearCategoria = async ({nombre, ID_Restaurante}) => {
    try {
        if (!nombre) throw new Error('Nombre no proporcionado');
        if (!ID_Restaurante) throw new Error('ID de restaurante no proporcionado en el token');
    
        // Verificar si ya existe una categoría con el mismo nombre en el mismo restaurante
        const categoriaExistente = await Categoria.findOne({
            where: {
                nombre,
                restaurante_id: ID_Restaurante
            }
        });
    
        if (categoriaExistente) {
            throw new Error(`La categoría ${nombre} ya existe en este restaurante.`);
        }
    
        // Crear la nueva categoría
        const nuevaCategoria = await Categoria.create({
            nombre,
            activo: true,
            restaurante_id: ID_Restaurante
        });
    
        if (!nuevaCategoria) throw new Error('No se pudo crear la categoría');
    
        return {
            message: `Categoría ${nombre} creada con éxito`
        };
    
    } catch (error) {
        throw error;
    }
    
}


const obtenerCategorias = async ({ID_Restaurante}) => {
    try {
        if (!ID_Restaurante) throw new Error ('ID restaurante no proporcionado en el token')  
        const categorias = await Categoria.findAll({ where: {   
         [Op.or]: [
            { restaurante_id: ID_Restaurante }, // Coincide con el restaurante específico
            { restaurante_id: null } // Coincide con los valores NULL
          ]}})
        if (!categorias)  throw new Error ('no se pudo obtener las categorias')  

        if (categorias.length === 0) {
            throw new Error('No hay categorias disponibles para este restaurante');
        }
        
        // Retornar los roles formateados
        return {
            categorias: categorias.map(categoria => ({
                id: categoria.id_categoria,
                nombre: categoria.nombre,
            }))
        };        

    } catch (error) {
        throw error; 
    }
}

const obtenerCategoria = async ({id}) => {
    try {
        if (!id)  throw new Error ('id de categorias no proporcionado')  
        const categoria = await Categoria.findOne({
            where: {id_categoria: id}
        })
        if (!categoria) throw new Error ('no existe categoria con esa id')  
        return {
            id: id,
            categoria: categoria.nombre
        }
    } catch (error) {
        throw error; 
    }
}


const actualizarCategoria = async ({id, nombre, ID_Restaurante}) => {
    try {
        const [updatedRows] = await Categoria.update(
            { nombre }, // Campos a actualizar
            {
                where: {
                    id_categoria: id,
                    restaurante_id: ID_Restaurante // Asegura que la categoría pertenece al restaurante
                }
            }
        );

        if (updatedRows === 0) {
            throw new Error('No se encontró la categoría o no pertenece al restaurante especificado.');
        }

        return { message: 'Categoría actualizada correctamente.' };
    } catch (error) {
        throw error; 
    }
}


const eliminarCategoria = async ({id, ID_Restaurante}) => {
    try {
        const [updatedRows] = await Categoria.update(
            { activo: false }, // Campos a actualizar
            {
                where: {
                    id_categoria: id,
                    restaurante_id: ID_Restaurante // Asegura que la categoría pertenece al restaurante
                }
            }
        );

        if (updatedRows === 0) {
            throw new Error('No se encontró la categoría o no pertenece al restaurante especificado.');
        }

        return { message: 'Categoría deshabilitada correctamente.' };
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

export default { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, eliminarCategoria }