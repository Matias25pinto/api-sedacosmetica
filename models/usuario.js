const mongoose = require("mongoose"); // importar mongoose
const uniqueValidator = require("mongoose-unique-validator"); // importar uniqueValidator para validar valores unicos

let Schema = mongoose.Schema; // crear esquema

//Creamos el objeto Schema con todas sus propiedades

let usuarioSchema = new Schema({
	nombre: {
		type: String,
		require: [true, "El nombre es obligatorio"],
	},
	apellido: {
		type: String,
		require: [true, "El apellido es obligatorio"],
	},
	cedula: {
		type: String,
		unique: true,
		require: [true, "La cédula es obligatoria"],
	},
	ruc: {
		type: String,
		require: false,
	},
	celular: {
		type: Number,
		require: [true, "El celular es obligatorio"],
	},
	email: {
		type: String,
		unique: true,
		require: [true, "El email es obligatorio"],
	},
	password: {
		type: String,
		require: [true, "El password es obligatorio"],
	},
	img: {
		type: String,
		require: false,
	},
	role: {
		type: String,
		required: [true, "El campo es obligatorio"],
		default: "CLIENT_ROLE",
	},
	estado: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
	sucursal: {
		type: Schema.Types.ObjectId,
		ref: "Sucursal",
		required: false,
	},
	precios: {
		type: Array,
		required: [true, "La lista de precios es obligatoria"],
	},
	deposito: {
		type: Number,
		required: [true, "El deposito es obligatorio"],
	},
});

//Eliminamos el password del JSON, de esta forma cuando se consulte el modelo el password nunca sera visible
usuarioSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;
	return userObject;
};
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Usuario", usuarioSchema);
