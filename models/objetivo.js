const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjetivoSchema = new Schema({
	incremento: {
		type: Number,
		require: [true, "El porcentaje es obligatorio"],
	},
	mes: {
		type: Number,
		require: [true, "El mes es obligatorio"],
	},
	year: {
		type: Number,
		require: [true, "El year es obligatorio"],
	},
	sucursal: {
		type: Schema.Types.ObjectId,
		ref: "Sucursal",
	},
});

module.exports = mongoose.model("Objetivo", ObjetivoSchema);
