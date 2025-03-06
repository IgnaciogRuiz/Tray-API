const sequelize = require('./database');
const { DataTypes } = require('sequelize');

const Usuario = sequelize.define('Usuario', {
  DNI: { type: DataTypes.INTEGER, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  apellido: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  contraseña: { type: DataTypes.STRING(100), allowNull: false },
  tokenRecuperacion: { type: DataTypes.STRING(6) },
  tokenExpiracion: {type: DataTypes.DATE, allowNull: true} 
});

const Mesa = sequelize.define('Mesa', {
  id_mesa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero_mesa: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  estado: { type: DataTypes.STRING(50), allowNull: false },
});

const Pedido = sequelize.define('Pedido', {
  id_pedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.STRING(50), allowNull: false },
  cubiertos: {type: DataTypes.INTEGER, allowNull: false}
});

const Categoria = sequelize.define('Categoria', {
  id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false }
});

const Producto = sequelize.define('Producto', {
  id_producto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  activo: {type: DataTypes.BOOLEAN, allowNull: false}
});

const Menu = sequelize.define('Menu', {
  id_menu: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  activo: {type: DataTypes.BOOLEAN, allowNull: false}
});

const MenuProducto = sequelize.define('MenuProducto', {
  cantidad: { type: DataTypes.INTEGER, allowNull: false }
});

const DetallePedido = sequelize.define('DetallePedido', {
  id_detalle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.STRING(50), allowNull: false }
});

const Turno = sequelize.define('Turno', {
  id_turno: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false },
  jornada: { type: DataTypes.STRING(20), allowNull: false }
});

const Rol = sequelize.define('Rol', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  descripcion: { type: DataTypes.TEXT }
});

const Restaurante = sequelize.define('Restaurante', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  telefono: { type: DataTypes.STRING(20), allowNull: false },
  fecha_inicio_plan: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_fin_plan: { type: DataTypes.DATEONLY, allowNull: false },
  estado_plan: { type: DataTypes.STRING(50), allowNull: false },
  tokenRestaurante: { type: DataTypes.STRING(6), allowNull: false, unique: true },
  cobra_cubiertos: {type: DataTypes.BOOLEAN, allowNull: false},
  precio_cubiertos: {type: DataTypes.DECIMAL(10,2), allowNull: false}
});

const Plan = sequelize.define('Plan', {
  id_plan: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  numero_empleados: { type: DataTypes.INTEGER, allowNull: false },
  numero_mesas: { type: DataTypes.INTEGER, allowNull: false },
  facturacion: { type: DataTypes.BOOLEAN, allowNull: false },
  precio: {type: DataTypes.DECIMAL(10,2), allowNull: false}
});
 
const Direccion = sequelize.define('Direccion', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  calle: { type: DataTypes.STRING(100), allowNull: false },
  numero: { type: DataTypes.INTEGER, allowNull: false },
  cp: { type: DataTypes.INTEGER, allowNull: false },
  localidad: { type: DataTypes.STRING(50), allowNull: false }
});

const UsuarioRestaurante = sequelize.define('UsuarioRestaurante', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rol: { type: DataTypes.STRING(50), allowNull: false },
  activo: {type: DataTypes.BOOLEAN, allowNull: false}
});

const Factura = sequelize.define('Factura', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: {type: DataTypes.DATE, allowNull: false},
  total: {type: DataTypes.DECIMAL(10,2), allowNull: false},
  metodo_pago: {type: DataTypes.ENUM('Efectivo','Transferencia', 'Tarjeta Debito', 'Tarjeta Credito'), allowNull: false},
  numero_factura: {type: DataTypes.STRING(50), allowNull: false}
});

//relaciones
Restaurante.hasMany(UsuarioRestaurante, { foreignKey: 'restaurante_id' });
UsuarioRestaurante.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(Turno, { foreignKey: 'restaurante_id' });
Turno.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(Menu, { foreignKey: 'restaurante_id' });
Menu.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(DetallePedido, { foreignKey: 'restaurante_id' });
DetallePedido.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(Pedido, { foreignKey: 'restaurante_id' });
Pedido.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(Producto, { foreignKey: 'restaurante_id' });
Producto.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(Mesa, { foreignKey: 'restaurante_id' });
Mesa.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(Factura, { foreignKey: 'restaurante_id' });
Factura.belongsTo(Restaurante, { foreignKey: 'restaurante_id' });

Restaurante.hasMany(Rol, { foreignKey: 'restaurante_id', allowNull: true });
Rol.belongsTo(Restaurante, { foreignKey: 'restaurante_id', allowNull: true });

Usuario.hasMany(UsuarioRestaurante, { foreignKey: 'usuario_DNI' });
UsuarioRestaurante.belongsTo(Usuario, { foreignKey: 'usuario_DNI' });

Usuario.hasMany(Turno, { foreignKey: 'usuario_DNI' });
Turno.belongsTo(Usuario, { foreignKey: 'usuario_DNI' });

Usuario.hasMany(Pedido, { foreignKey: 'usuario_DNI' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_DNI' });

Mesa.hasMany(Pedido, { foreignKey: 'mesa_id' });
Pedido.belongsTo(Mesa, { foreignKey: 'mesa_id' });

Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Pedido.hasMany(Factura, { foreignKey: 'pedido_id' });
Factura.belongsTo(Pedido, { foreignKey: 'pedido_id' });


Producto.hasMany(DetallePedido, { foreignKey: 'producto_id' });
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });

Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Menu.belongsToMany(Producto, { through: MenuProducto, foreignKey: 'menu_id' });
Producto.belongsToMany(Menu, { through: MenuProducto, foreignKey: 'producto_id' });

Restaurante.belongsTo(Plan, { foreignKey: 'plan_id' });
Plan.hasMany(Restaurante, { foreignKey: 'plan_id' });

Restaurante.belongsTo(Direccion, { foreignKey: 'direccion_id' });
Direccion.hasOne(Restaurante, { foreignKey: 'direccion_id' });

Turno.belongsTo(Rol, { foreignKey: 'rol_id' });
Rol.hasMany(Turno, { foreignKey: 'rol_id' });

module.exports = {
  sequelize,
  Usuario,
  Mesa,
  Pedido,
  Categoria,
  Producto,
  Menu,
  MenuProducto,
  DetallePedido,
  Turno,
  Rol,
  Restaurante,
  Plan,
  Direccion,
  UsuarioRestaurante,
  Factura
};
