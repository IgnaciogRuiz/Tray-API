const { sequelize, Usuario, Mesa, Pedido, Categoria, Producto, Menu, MenuProducto, DetallePedido, Turno, Rol, Restaurante, Plan, Direccion, UsuarioRestaurante } = require('./schema');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    await sequelize.sync({ force: true }); // Usa `force: true` para borrar y recrear tablas
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}
 
syncDatabase();
