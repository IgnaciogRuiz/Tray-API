const { Categoria } = require('../database/schema');


const crearCategoria = async ({nombre}) => {
    try {
        if (!nombre) throw new Error ('nombre no proporcionado')

        const nuevaCategoria = await Categoria.create({
            ID: null,
            nombre: nombre
        })    
        if (!nuevaCategoria)  throw new Error ('no se pudo crear la categoria')

        const mensaje = "Categoria "+ nombre + "creada con exito"
        return {
            message: mensaje
        }

        
    } catch (error) {
        throw error; 
    }
}


const obtenerCategorias = async ({}) => {
    try {
        const categorias = await Categoria.findAll({})
        if (!categorias)  throw new Error ('no se pudo obtener las categorias')  

        if (categorias.length === 0) {
            throw new Error('No hay categorias disponibles para este restaurante');
        }
        
        // Retornar los roles formateados
        return {
            categorias: categorias.map(categoria => ({
                id: categoria.id,
                nombre: categoria.nombre,
            }))
        };        

    } catch (error) {
        throw error; 
    }
}

const obtenerCategoria = async ({params}) => {
    try {
        
    } catch (error) {
        throw error; 
    }
}


const actualizarCategoria = async ({params}) => {
    try {
        
    } catch (error) {
        throw error; 
    }
}


const eliminarCategoria = async ({params}) => {
    try {
        
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

module.exports = { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, eliminarCategoria }