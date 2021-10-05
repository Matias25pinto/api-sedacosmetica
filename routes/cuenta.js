const { Router } = require("express");
const { check } = require("express-validator");

const {
	crearCuenta,
	modificarCuenta,
	cuentas,
	cuenta,
	eliminarCuenta,
} = require("../controllers/cuenta");

const {
	verificarToken,
	verificarAdminRol,
} = require("../middlewares/autenticacion");

const { existeBanco } = require("../helpers/validar-bd");

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
		check("banco").not().isEmpty(),
		check("banco").custom(existeBanco),
		check("titular").not().isEmpty(),
		check("nroCuenta").not().isEmpty(),
		validarChecks,
	],
	crearCuenta
);

router.put(
	"/:id",
	[
		validarIdMongoose,
		verificarToken,
		verificarAdminRol,
		check("banco").not().isEmpty(),
		check("banco").custom(existeBanco),
		check("titular").not().isEmpty(),
		check("nroCuenta").not().isEmpty(),
		validarChecks,
	],
	modificarCuenta
);

router.get("/", [verificarToken], cuentas);

router.get("/:id", [validarIdMongoose, verificarToken, validarChecks], cuenta);

router.delete(
	"/:id",
	[validarIdMongoose, verificarToken, verificarAdminRol],
	eliminarCuenta
);

module.exports = router;
