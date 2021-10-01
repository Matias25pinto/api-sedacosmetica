const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const BancoSchema = new Schema({
	nombre: {
		type: String,
		required: [true, "El campo nombre es obligatorio"],
		unique: true,
	},
	estado: {
		type: Boolean,
		required: false,
		default: true,
	},
	desc: {
		type: String,
		required: [true, "El campo desc es obligatorio"],
	},
});

mongoose.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Banco", BancoSchema);
