require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

//middleware que solicita el token jwt generado al iniciar sesion
const authMiddleware = (req, res, next) => {
    // Obtener el token del encabezado
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        // Agregar el usuario decodificado a la solicitud para usarlo en otras rutas
        req.user = decoded;
        next(); // Continuar con la siguiente función de middleware o ruta
    });
};

module.exports = authMiddleware;