'use strict'

var app = require('./app/app');
var port = process.env.PORT || 3700;
var conexion = require('./config/database')

if (conexion) {
    // Creacion del servidor
    app.listen(port, () => {
        console.log("Servidor corriendo correctamente en la url: http://localhost:"+port);
    });
}
