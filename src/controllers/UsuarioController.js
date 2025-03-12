import UsuarioService from '../services/UsuarioService.js';
import { response } from 'express';



var UsuarioController = {
  test: function(req, res){
    const { DNI, ID_Restaurante } = req.user;
    return res.status(200).send({
      message: 'Test Controller Usuario', DNI: DNI, ID_restaurante: ID_Restaurante
    });
  },
  obtenerEmpleados: async function (req, res) {
    const { DNI, ID_Restaurante } = req.user || {};
    
    try {
      const response = await UsuarioService.obtenerEmpleados({DNI, ID_Restaurante});
      res.status(200).json({ response });

    } catch (error) {
      //console.error('Error en obtenerEmpleados', error);
      res.status(400).json({ error: 'Error al obtenerEmpleados', message: error.message });
    }
  },
  obtenerUsuario: async function (req, res) {
    const { DNI } = req.user || {};
    try {     
      const response = await UsuarioService.obtenerUsuario({DNI});
      res.status(200).json({ response});
  } catch (error) {
      //console.error('Error al obtener usuario:', error);
      res.status(400).json({ error: 'Error del servidor',  message: error.message });
  }
  },
  actualizarPassword: async function (req, res) {
    const { DNI } = req.user || {};
    const { password, nuevaPassword, repPassword } = req.body || {};
    try {
      const response = await UsuarioService.cambiarPassword({DNI, password, nuevaPassword, repPassword});
      res.status(200).json({ response });
    } catch (error) {
      //console.error('Error al cambiar contraseña:', error);
      res.status(400).json({ error: 'Error del servidor',  message: error.message });
    }
  },
  actualizarUsuario: async function (req, res) {
    const { DNI } = req.user;
    const { nombre, apellido, email } = req.body;

    try {
      const response = await UsuarioService.actualizarUsuario({DNI, nombre, apellido, email});
      res.status(200).json({ response });   
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(400).json({ Error: 'Error al actualizar usuario', message: error.message });
    }
  },
  eliminarUsuariodeRestaurante: async function (req, res) {
    const { DNI } = req.user;
    try {
      const response = await UsuarioService.eliminarUsuario({DNI});
      res.status(200).json({response});
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(400).json({ error: 'Error al eliminar usuario', message: error.message });
    }
  }
}


 
export default UsuarioController;