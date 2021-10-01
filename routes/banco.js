const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearBanco,
	modificarBanco,
	bancos,
	banco,
	eliminarBancos,
} = require("../controllers/banco");

const {
	verificarToken,
	verificarAdminRol,
} = require("../middlewares/autenticacion");

const {
	validarChecks,
	validarIdMongoose,
} = require("../middlewares/validar-campos");

const router = Router();

router.post(
	"/",
	[
		verificarToken,
		verificarAdminRol,
		check("nombre").not().isEmpty(),
		check("desc").not().isEmpty(),
		validarChecks,
	],
	crearBanco
);

router.put(
	"/:id",
	[
		validarIdMongoose,
		verificarToken,
		verificarAdminRol,
		check("nombre").not().isEmpty(),
		check("desc").not().isEmpty(),
		validarChecks,
	],
	modificarBanco
);

router.get("/", [verificarToken], bancos);

router.get(
	"/:id",
	[validarIdMongoose, verificarToken, verificarAdminRol],
	banco
);

router.delete(
	"/:id",
	[validarIdMongoose, verificarToken, verificarAdminRol],
	eliminarBancos
);

module.exports = router;
