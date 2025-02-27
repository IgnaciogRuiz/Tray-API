/*
Gestiona todo lo relacionado con los usuarios (administradores y mozos), incluyendo autenticación y roles.
Funciones:
    crearUsuario: Registrar nuevos usuarios, Admin y Empleados.
    iniciarSesion: Autenticación y generación de token (si usas JWT).
    listarUsuarios: Obtener una lista de usuarios (solo para administradores).
    actualizarUsuario: Editar información de un usuario.
    eliminarUsuario: Desactivar o eliminar usuarios (según necesidad).
 */

//importar dependencias
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
//importar archivos
const Usuario = require('../models/Usuario');
const {generarTokenUnico, generarTokenRecuperacion } = require('../utils/generarToken'); 
const generarJWT = require('../utils/generarJWT');


var UsuarioController = {
  test: function(req, res){
    return res.status(200).send({
      message: 'Test Controller Usuario'
    });
  },
  CreateAdmin: async function(req, res) {
      const { DNI, nombre, apellido, password, repPassword, email } = req.body;
      
      //verificar que manden los campos
      var camposRequeridos = ['DNI', 'nombre', 'apellido', 'contraseña', 'repcontraseña', 'email'];
      for (let campo of camposRequeridos) {
        if (!req.body[campo]) {
          return res.status(400).json({ message: `${campo} no proporcionado` });
        }
      }   

      try {
          // Verificar si el usuario ya existe
          const usuarioExistente = await Usuario.findOne({ where: { DNI } });
          if (usuarioExistente) {
              return res.status(400).json({ message: 'El usuario ya existe' });
          }

          //verificar si se repite la contraseña
          if (password == repPassword) {
              // Hashear la contraseña
              var hash = await bcrypt.hash(password, 10);
          } else {
            return res.status(400).json({ message: 'las contraseñas no coinciden' });
          }

        
          // llamar a la funcion para generar un token unico
          var tokenRestaurante = await generarTokenUnico();
          

          // Crear el usuario con rol admin
          const nuevoUsuario = await Usuario.create({
              DNI,
              nombre,
              apellido,
              contraseña: hash,
              rol: 'admin',
              tokenRestaurante,
              email,
          });

          res.status(201).json({ message: 'Dueño registrado con éxito', tokenRestaurante });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al registrar dueño' });
      }
  },
  CreateEmpleado: async function(req, res) {
    const { DNI, nombre, apellido, password, repPassword, tokenRestaurante, email } = req.body;

    try {
        // Verificar si el tokenRestaurante existe
        const restaurante = await Usuario.findOne({ where: { tokenRestaurante, rol: 'admin' } });
        if (!restaurante) {
            return res.status(400).json({ message: 'Código de restaurante inválido' });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { DNI } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        //verificar si se repite la contraseña
        if (password == repPassword) {
          // Hashear la contraseña
          var hash = await bcrypt.hash(password, 10);
        } else {
          return res.status(400).json({ message: 'las contraseñas no coinciden' });
        }

        // Crear el usuario con rol empleado
        const nuevoUsuario = await Usuario.create({
            DNI,
            nombre,
            apellido,
            contraseña: hash,
            rol: 'empleado',
            tokenRestaurante,
            email,
        });

        res.status(201).json({ message: 'Empleado registrado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar empleado'});
    }
  },
  login: async function (req, res) {
    const { DNI, password} = req.body;

    try {
      // Verificar si el usuario existe
      const user = await Usuario.findOne({ where: { DNI } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Comparar la contraseña ingresada con la almacenada en la base de datos
      var coincide = await bcrypt.compare(password, user.contraseña);
      if (! coincide) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }

      // Llamar a la función para generar el token
      const token = await generarJWT(user.DNI , user.tokenRestaurante);

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  solicitarRecuperacion: async (req, res) => {
    const { email } = req.body;

    try {
        var user = await Usuario.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        //generar y guardar token en el usuario
        var tokenRecuperacion = generarTokenRecuperacion();
        user.tokenRecuperacion = tokenRecuperacion;
        await user.save();

        // Configuración de nodemailer
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        // Contenido del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Tu código de recuperación es: ${tokenRecuperacion}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Código de recuperación enviado al correo' });
    } catch (error) {
        console.error('Error en solicitarRecuperacion', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  verificarTokenRecuperacion: async (req, res) => {
    const { email, tokenRecuperacion } = req.body;

    try {
        var user = await Usuario.findOne({ where: { email: email, tokenRecuperacion: tokenRecuperacion } });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        res.status(200).json({ message: 'Token válido' });
    } catch (error) {
        console.error('Error en verificarTokenRecuperacion', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  actualizarContrasena: async (req, res) => {
    const { email, tokenRecuperacion, nuevaPassword, repPassword } = req.body;

    try {
        const user = await Usuario.findOne({ where: { email: email, tokenRecuperacion: tokenRecuperacion } });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        if (nuevaPassword == repPassword) {
          // Hashear la contraseña
          var hash = await bcrypt.hash(nuevaPassword, 10);
          user.contraseña = hash; // Puedes hashearla si quieres mayor seguridad
          user.tokenRecuperacion = null; // Invalida el token después de usarlo
          if(await user.save()){
            res.status(200).json({ message: 'Contraseña actualizada correctamente' });        
          } 
        } else {
          return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }
        
    } catch (error) {
        console.error('Error en actualizarContrasena', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  obtenerEmpleados: async function (req, res) {
    const { tokenRestaurante } = req.user;

    var user = await Usuario.findAll({
      where: 
      {
        tokenRestaurante: tokenRestaurante,
        rol: 'empleado'
      },
      attributes: ['DNI', 'nombre', 'apellido']
    });

    if(!user) {
      return res.status(400).json({ message: 'No tienes empleados' });
    } else {
      return res.status(200).json({ Usuarios: user });
    }
  },
  obtenerUsuario: async function (req, res) {
    try {
      const { DNI } = req.user;

      const user = await Usuario.findOne({ where: { DNI: DNI } });

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({ DNI: user.DNI, nombre: user.nombre, apellido: user.apellido, email: user.email});

  } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
  }
  },
  actualizarUsuario: async function (req, res) {
    try {
      const { DNI } = req.user;
      const { nombre, apellido, email } = req.body;

      // Verificar si el usuario existe
      const usuario = await Usuario.findOne({ where: { DNI: DNI } });
      if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
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
              return res.status(400).json({ message: 'El email ya está en uso' });
          }
      }

      // Actualizar solo los campos que vienen en el request
      if (nombre) usuario.nombre = nombre;
      if (apellido) usuario.apellido = apellido;
      if (email) usuario.email = email;

      // Guardar los cambios
      await usuario.save();

      // Devolver el usuario actualizado
      res.status(200).json({ message: 'Usuario actualizado con éxito'});
      
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },
}


 
module.exports = UsuarioController;