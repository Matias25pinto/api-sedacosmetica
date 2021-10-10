const Usuario = require("../models/usuario");

const verificarEmail = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { email } = req.body;
		const existeEmail = await Usuario.findOne({ email });
		if (existeEmail) {
			if (existeEmail._id != id) {
				return res.status(404).json({
					msg: "ERROR, el email ya esta siendo utilizado en otra cuenta",
				});
			}
		}
		next();
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const verificarCedula = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { cedula } = req.body;
		const existeCedula = await Usuario.findOne({ cedula });
		if (existeCedula) {
			if (existeCedula._id != id) {
				return res.status(404).json({
					msg: "ERROR, La cédula ya esta siendo utilizado en otra cuenta",
				});
			}
		}
		next();
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

module.exports = {
	verificarEmail,
	verificarCedula,
};
