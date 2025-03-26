// src/index.js
import app from './app/app.js';
import conexion from './database/database.js';

const port = process.env.PORT || 3700;

if (conexion) {
    // Creación del servidor
    app.listen(port, () => {
        console.log(`Servidor corriendo correctamente en la URL: http://localhost:${port}`);
    });
}
