
const { Sequelize } = require('sequelize');

// Configuración de conexión
const sequelize = new Sequelize('tray', 'root', '', {
  host: 'localhost',         // O la IP del servidor de BD
  dialect: 'mysql',          // Tipo de base de datos
  logging: false,            // Desactiva el logging de SQL en consola
  define: {
    freezeTableName: true,   // Evita que Sequelize pluralice los nombres de las tablas
    timestamps: false        // Desactiva la creación automática de createdAt y updatedAt
  }
});

//Verificar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
})();

module.exports = sequelize;
