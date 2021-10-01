const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const CuentaSchema = new Schema({
	cuenta: {
		type: String,
		required: [true, "El campo cuenta es obligatorio"],
		unique: true,
	},
	banco: {
		type: Schema.Types.ObjectId,
		ref: "Banco",
		required: [true, "El campo banco es obligatorio"],
	},
	desc: {
		type: String,
		required: [true, "El campo desc es obligatorio"],
	},
});

mongoose.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Cuenta", CuentaSchema);
