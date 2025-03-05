const { Usuario, UsuarioRestaurante } = require('../database/schema');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');

const obtenerEmpleados = async function ({DNI, ID_Restaurante}) {

  try {
    // Verificar el rol del usuario
    const usuario = await UsuarioRestaurante.findOne({
      where: {
        usuario_DNI: DNI,
        restaurante_id: ID_Restaurante
      }
    });

    if (!usuario) {
      return { message: "Usuario no encontrado en este restaurante" };
    }

    if (usuario.rol === "empleado") {
      return { message: "Los empleados no pueden ver la lista de empleados" };
    }
    
    const empleados = await UsuarioRestaurante.findAll({
        where: {
            restaurante_id: ID_Restaurante,
            rol: { [Op.like]: "%empleado%" } // Evita espacios ocultos
        },
        include: [
            {
                model: Usuario,
                attributes: ["DNI", "nombre", "apellido"]
            }
        ]
    });


    if (empleados.length === 0) {
        return {message: "no tienes empleados"}
    }

    return {
      Usuarios: empleados.map(emp => ({
          DNI: emp.Usuario.DNI,
          nombre: emp.Usuario.nombre,
          apellido: emp.Usuario.apellido
      })) 
    };  
  } catch (error) {
    throw error
  }

};

const obtenerUsuario = async function ({DNI}) {
  try {
    const user = await Usuario.findOne({ where: { DNI: DNI } });
    if (!user) {
      throw new Error ('Usuario no encontrado');
    }

    return { DNI: user.DNI, nombre: user.nombre, apellido: user.apellido, email: user.email};
  } catch (error) {
    throw error
  }
};

const cambiarPassword = async function ({DNI, password, nuevaPassword, repPassword}) {
    try {
      if (!password) throw new Error ('campo password requerido');
      if (!nuevaPassword) throw new Error ('campo nuevaPassword requerido');
      if (!repPassword) throw new Error ('campo repPassword requerido');

      const user = await Usuario.findOne({ where: { DNI: DNI } });
      if (!user) {
        throw new Error ('Usuario no encontrado');
      } 

      // Comparar la contraseña ingresada con la almacenada en la base de datos
      const coincide = await bcrypt.compare(password, user.contraseña);
      if (!coincide) {
        throw new Error ('Contraseña incorrecta');
      }

      if (nuevaPassword == repPassword) {
        // Hashear la contraseña
        var hash = await bcrypt.hash(nuevaPassword, 10);
        user.contraseña = hash; // Puedes hashearla si quieres mayor seguridad
        user.tokenRecuperacion = null; // Invalida el token después de usarlo
        if(await user.save()){
          return { message: "contraseña cambiada con exito"}       
        } 
      } else {
          throw new Error ('Las contraseñas no coinciden');
      }
    } catch (error) {
      throw error
    }
}

const actualizarUsuario = async function ({DNI, nombre, apellido, email}) {
  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { DNI: DNI } });
    if (!usuario) {
        throw new Error ('Usuario no Encontrado');
    }

    // Si se quiere cambiar el email, verificar que no esté en uso
    if (email && email !== usuario.email) {
        const emailExistente = await Usuario.findOne({ 
            where: { 
                email: email, 
                DNI: { $ne: DNI } // Verificar que no sea el mismo usuario
            } 
        });

        if (emailExistente) {
            throw new Error ('El email ya está en uso')
        }
    }

    // Actualizar solo los campos que vienen en el request
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (email) usuario.email = email;

    // Guardar los cambios
    await usuario.save();
    return {
      message: 'Datos modificados con exito'
    }
  } catch (error) {
      throw error
  }

}

//cambiar destroy a update activo: false
const eliminarUsuario = async function ({DNI}) {
  try {
    const relacionUsuario = await UsuarioRestaurante.destroy({
      where: {
        usuario_DNI: DNI
      },
    })
    if(!relacionUsuario) throw new Error ('error al eliminar el usuario');
    return { message: 'Usuario eliminado con exito'}
  } catch (error) {
    throw error
  }
}


module.exports = { obtenerEmpleados, obtenerUsuario, cambiarPassword, actualizarUsuario, eliminarUsuario }