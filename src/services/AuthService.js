//importar dependencias
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

//importar archivos
const { sequelize, Usuario, Restaurante, Plan, UsuarioRestaurante, Direccion } = require('../database/schema');
const {generarTokenUnico, generarTokenRecuperacion, verificarTokenRecuperacion } = require('../utils/generarToken'); 
const generarJWT = require('../utils/generarJWT');
const { where } = require('sequelize');



const crearAdmin = async ({ DNI, nombre, apellido, password, repPassword, email, nombreRestaurante, telefono, idPlan, calleDomicilio, numeroDomicilio, cp, localidad }) => {
    const transaction = await sequelize.transaction(); // ✅ Iniciar transacción

    try {
        // Validar que no falten campos
        const camposRequeridos = { DNI, nombre, apellido, password, repPassword, email, nombreRestaurante, telefono, idPlan, calleDomicilio, numeroDomicilio, cp, localidad };
        for (let [campo, valor] of Object.entries(camposRequeridos)) {
            if (!valor) {
                throw new Error(`${campo} no proporcionado`);
            }
        }

        // Verificar si el DNI ya existe
        const DNIExistente = await Usuario.findOne({ 
            where: { DNI } 
        });
        if (DNIExistente) {
            throw new Error('ya existe un usuario con ese DNI');
        }

        // Verificar si el  mail ya existe
        const MailExistente = await Usuario.findOne({ 
           where: { email } 
        });
        if (MailExistente) {
            throw new Error('Ese mail ya esta en uso');
        }


        // Verificar si las contraseñas coinciden
        if (password !== repPassword) {
            throw new Error('Las contraseñas no coinciden');
        }

        // Hashear la contraseña
        const hash = await bcrypt.hash(password, 10);

        // Crear el usuario en la tabla Usuarios
        const nuevoUsuario = await Usuario.create({
            DNI,
            nombre,
            apellido,
            email,
            contraseña: hash,
        }, { transaction }); 

        // Obtener datos del plan elegido
        const plan = await Plan.findByPk(idPlan, { transaction });
        if (!plan) {
            throw new Error('El plan seleccionado no existe');
        }

        // Calcular fechas del plan
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaInicio.getMonth() + 1); // Ejemplo: Plan dura 1 mes

        // Crear domicilio del restaurante
        const nuevoDomicilio = await Direccion.create({
            calle: calleDomicilio,
            numero: numeroDomicilio,
            cp: cp,
            localidad: localidad
        }, { transaction });

        const id_domicilio = nuevoDomicilio.ID;

        // Generar un token único para el restaurante
        const tokenRestaurante = await generarTokenUnico();

        // Crear el restaurante en la tabla Restaurante
        const nuevoRestaurante = await Restaurante.create({
            nombre: nombreRestaurante,
            telefono,
            fecha_inicio_plan: fechaInicio,
            fecha_fin_plan: fechaFin,
            estado_plan: 'activo',
            tokenRestaurante,
            plan_id: idPlan,
            direccion_id: id_domicilio,
        }, { transaction });

        // Crear la relación en UsuarioRestaurante con el rol de "admin"
        await UsuarioRestaurante.create({
            usuario_DNI: nuevoUsuario.DNI,
            restaurante_id: nuevoRestaurante.ID,
            rol: 'admin',
        }, { transaction });

        // ✅ Confirmar la transacción si todo sale bien
        await transaction.commit();

        return {
            message: 'Administrador, restaurante y plan registrados con éxito',
            DNI: nuevoUsuario.DNI,
            restaurante_id: nuevoRestaurante.ID,
            token_restaurante: tokenRestaurante,
            plan: {
                id: idPlan,
                nombre: plan.nombre,
                limite_empleados: plan.numero_empleados,
                limite_mesas: plan.numero_mesas,
            },
        };
    } catch (error) {
        await transaction.rollback();
        //console.error("Error en crearAdmin:", error);
        throw error;
    }
};

const crearEmpleado = async ({ DNI, nombre, apellido, password, repPassword, tokenRestaurante, email}) => { 
    const transaction = await sequelize.transaction(); // ✅ Iniciar transacción
    
    try {
        // Verificar si el tokenRestaurante existe
        const restaurante = await Restaurante.findOne({ where: { tokenRestaurante } });
        if (!restaurante) {
            throw new Error ('Código de restaurante inválido')
        }

        // Verificar si el DNI ya existe
        const DNIExistente = await Usuario.findOne({ 
            where: { DNI } 
        });
        if (DNIExistente) {
            throw new Error('ya existe un usuario con ese DNI');
        }

        //Traer Plan de restaurante
        const PlanRestaurante = await Plan.findOne({
             where: { id_plan: restaurante.plan_id}
        });

        if (PlanRestaurante) {
            //verificar si el Plan de restaurante esta con limite de empleado
            const limiteEmpleados = await UsuarioRestaurante.findAll({
                where: { restaurante_id: restaurante.ID}
            });
            if (limiteEmpleados.length > PlanRestaurante.numero_empleados) {
                throw new Error('El Plan del restaurante ya cumple con el limite de empleados');
            }
        }


        // Verificar si el  mail ya existe
        const MailExistente = await Usuario.findOne({ 
            where: { email } 
        });
        if (MailExistente) {
            throw new Error('Ese mail ya esta en uso');
        }
        


        //verificar si se repite la contraseña
        if (password == repPassword) {
            // Hashear la contraseña
            var hash = await bcrypt.hash(password, 10);
        } else {
            throw new Error ('las contraseñas no coinciden');
        }

        // Crear el usuario con rol empleado
        const nuevoUsuario = await Usuario.create({
            DNI,
            nombre,
            apellido,
            contraseña: hash,
            email,
            tokenRecuperacion: null,
        }, { transaction });

        // Crear la relación en UsuarioRestaurante con el rol de "admin"
        await UsuarioRestaurante.create({
            usuario_DNI: DNI,
            restaurante_id: restaurante.ID,
            rol: 'empleado',
        }, { transaction });    
        
        //Confirmar la transacción si todo sale bien
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        //console.error("Error en crearAdmin:", error);
        throw error;   
    }

    
};

const login = async ({DNI, password}) => {
    try {

        // Buscar usuario por DNI
        const user = await Usuario.findOne({ where: { DNI } });

        if (!user) {
            throw new Error ('Usuario no encontrado');
        }


        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const coincide = await bcrypt.compare(password, user.contraseña);
        if (!coincide) {
            throw new Error ('Contraseña incorrecta');
        }

        // Obtener los restaurantes en los que trabaja el usuario y su rol en cada uno
        const relaciones = await UsuarioRestaurante.findAll({
            where: { usuario_DNI: DNI },
            include: [
                {
                    model: Restaurante,
                    attributes: ['ID', 'nombre', 'tokenRestaurante']
                }
            ]
        });

        if (relaciones.length === 0) {
             // Si no trabaja en ningun restaurante generar token con el DNI para  '/login/vincular'
            var token = await generarJWT(user.DNI);
            return {
                message: 'Login exitoso',
                token,
                usuario: {
                    DNI: user.DNI,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email
                },
                restaurante: 'El usuario no tiene restaurantes asociados solicita la url "/api/auth/vincular" para vincularlo a un restaurante'
            };
        }

        // Construir la lista de restaurantes
        const restaurantes = relaciones.map(rel => ({
            restaurante_id: rel.Restaurante.ID,
            nombre: rel.Restaurante.nombre,
            tokenRestaurante: rel.Restaurante.tokenRestaurante,
            rol: rel.rol
        }));

        //Si solo trabaja en un restaurante, generar token con el ID
        if (restaurantes.length === 1) {
            var token = await generarJWT(user.DNI, restaurantes[0].restaurante_id);
            return {
                message: 'Login exitoso',
                token,
                usuario: {
                    DNI: user.DNI,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email
                },
                restaurante: restaurantes[0] // Enviamos el restaurante asignado
            };
        }

        // Si trabaja en varios restaurante generar token con el DNI para '/login/select' 
        var token = await generarJWT(user.DNI);

        return {
            message: 'Login exitoso',
            token,
            usuario: {
                DNI: user.DNI,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            },
            restaurantes
        };

    } catch (error) {
        throw error;   
    }

};

const select = async ({DNI, Restaurante_ID}) => {
    try {
        if (!Restaurante_ID) throw new Error('Restaurante_ID no proporcionado');
        const restaurante = await Restaurante.findOne({where: { ID: Restaurante_ID }});
        if (!restaurante) throw new Error ("El id del restaurante no existe");
        const token = await generarJWT( DNI, Restaurante_ID);
        return { message: "nuevo token creado", token: token}
    } catch (error) {
        throw error;  
    }
}

const vincular = async ({ tokenRestaurante}) => {
    try {
        const restaurante = await Restaurante.findOne({where: {tokenRestaurante: tokenRestaurante}})
        if (!restaurante) {
            throw new Error ('Token de restaurante Invalido');
        }
        //Traer Plan de restaurante
        const PlanRestaurante = await Plan.findOne({ where: { id_plan: restaurante.plan_id}});
        if (PlanRestaurante) {
            //verificar si el Plan de restaurante esta con limite de empleado
            const limiteEmpleados = await UsuarioRestaurante.findAll({
                where: { restaurante_id: restaurante.ID}
            });
            if (limiteEmpleados.length > PlanRestaurante.numero_empleados) {
                throw new Error('El Plan del restaurante ya cumple con el limite de empleados');
            }
        }

        const NuevoVinculo = await UsuarioRestaurante.create({
            usuario_DNI: DNI,
            restaurante_id: restaurante.ID,
            rol: 'empleado'
        })
        if(!NuevoVinculo) throw new Error ('error al crear el vinculo');
        const token = await generarJWT(user.DNI, restaurante.ID);
        return {message: "Usuario vinculado a restaurante con exito", token: token}

    } catch (error) {
        throw error; 
    }
}

const solicitarRecuperacion = async ({email}) => {
    try {
        var user = await Usuario.findOne({ where: { email: email } });
    
        if (!user) {
            throw new Error('Correo no registrado');
        }

        //generar y guardar token en el usuario
        const { token, expiracion } = generarTokenRecuperacion();
        user.tokenRecuperacion = token;
        user.tokenExpiracion = expiracion; 
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

        return {
            message: "Hemos enviado un codigo de recuperacion a tu mail"
        }
    } catch (error) {
        throw error; 
    }
};

const verificarToken = async ({email, tokenRecuperacion}) => {
    try {
        const user = await Usuario.findOne({ where: { email: email, tokenRecuperacion: tokenRecuperacion } });
        if (!user) {
            throw new Error('Token inválido o expirado');
        } 

        verificarTokenRecuperacion(user.tokenRecuperacion, user.tokenExpiracion);
        return {  message: "Token valido" }       
    } catch (error) {
        throw error; 
    }
};

const cambiarPassword = async ({email, tokenRecuperacion, nuevaPassword, repPassword }) => {
    try {
        // Validar que no falten campos
        const camposRequeridos = { email, tokenRecuperacion, nuevaPassword, repPassword };
        for (let [campo, valor] of Object.entries(camposRequeridos)) {
            if (!valor) {
                throw new Error(`${campo} no proporcionado`);
            }
        }

        const user = await Usuario.findOne({ where: { email: email, tokenRecuperacion: tokenRecuperacion } });
        if (!user) {
            throw new Error ('Token inválido o expirado');
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
        throw error; 
    }
}

// const MiFuncion = async ({params}) => {
//     try {
        
//     } catch (error) {
//         throw error; 
//     }
// }


module.exports = { crearAdmin, crearEmpleado, login, select, solicitarRecuperacion, verificarToken, cambiarPassword, vincular };