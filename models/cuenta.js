const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const CuentaSchema = new Schema({
	banco: {
		type: Schema.Types.ObjectId,
		ref: "Banco",
		required: [true, "El campo banco es obligatoria"],
	},
	titular: {
		type: String,
		required: [true, "El campo titular es obligatorio"],
	},
	nroCuenta: { type: String, required: [true, "El campo cuenta es obligatorio"] },
	estado: {
		type: Boolean,
		required: [true, "El campo estado es obligatorio"],
		default: true,
	},
});

mongoose.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Cuenta", CuentaSchema);
