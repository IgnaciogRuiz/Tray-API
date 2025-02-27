const { customAlphabet } = require('nanoid');
const Usuario = require('../models/Usuario');
const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; //para utilizar como token
const alfabetoNumerico = '0123456789';

// Función para generar un token único
async function generarTokenUnico() {
    let tokenRestaurante;
    let tokenExistente;
  
    do {
      tokenRestaurante = customAlphabet(alfabeto, 6)(); 
      tokenExistente = await Usuario.findOne({ where: { tokenRestaurante } }); // Verificar existencia
    } while (tokenExistente); 
  
    return tokenRestaurante; // Devolver token único
}

// Generar Token Recuperacion
const generarTokenRecuperacion = () => {
    const token = customAlphabet(alfabetoNumerico, 6)(); // Token numérico de 6 dígitos
    return token;
};


module.exports = {generarTokenRecuperacion, generarTokenUnico};