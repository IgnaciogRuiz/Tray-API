require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

//funcion para generar el json web token
const generarJWT = (DNI, ID_Restaurante) => {
    return new Promise((resolve, reject) => {
        const payload = { DNI, ID_Restaurante };
        const options = { expiresIn: '7d' };

        jwt.sign(payload, jwtSecretKey, options, (err, token) => {
            if (err) {
                console.error('Error generando el JWT', err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = generarJWT;