import { customAlphabet } from 'nanoid';
import { Restaurante } from '../database/models.js';  
import moment from 'moment';
const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
const alfabetoNumerico = '0123456789';

// Función para generar un token único
async function generarTokenUnico() {
  let tokenRestaurante;
  let tokenExistente;

  const nanoid = customAlphabet(alfabeto, 6); // Crear la función generadora de IDs

  do {
      tokenRestaurante = nanoid(); // Generar un token
      tokenExistente = await Restaurante.findOne({ where: { tokenRestaurante } }); // Verificar existencia
  } while (tokenExistente);

  return tokenRestaurante; // Devolver token único
}

// Generador de token numérico de 6 caracteres
const generarTokenRecuperacion = () => {
  const nanoid = customAlphabet('1234567890', 6); // Solo números, longitud 6
  return {
      token: nanoid(),
      expiracion: moment().add(1, 'hour').toISOString() // Expira en 1 hora
  };
};

const verificarTokenRecuperacion = (token, expiracion) => {
  if (!token || !expiracion) {
      throw new Error('Token inválido o expirado');
  }
  
  const ahora = moment();
  if (ahora.isAfter(moment(expiracion))) {
      throw new Error('Token expirado');
  }
  
  return { message: "Token válido" };
};


export {generarTokenRecuperacion, generarTokenUnico, verificarTokenRecuperacion };