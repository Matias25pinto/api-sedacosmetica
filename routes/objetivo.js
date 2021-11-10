const { Router } = require("express");

const { check } = require("express-validator");

const {
	verificarToken,
	verificarAdminRol,
} = require("../middlewares/autenticacion");

const {
	validarIdMongoose,
	validarChecks,
        validarObjetivo
} = require("../middlewares/validar-campos");

const { existeSucursal } = require("../helpers/validar-bd");

const {
	crearObjetivto,
	cambiarIncremento,
	objetivo,
} = require("../controllers/objetivo");

const router = Router();

router.get("/", [verificarToken, validarObjetivo], objetivo);

router.post(
	"/",
	[
		verificarToken,
		verificarAdminRol,
		check("incremento")
			.not()
			.isEmpty()
			.isNumeric()
			.isLength({ min: 1, max: 3 }),
		check("mes").not().isEmpty().isNumeric().isLength({ min: 1, max: 2 }),
		check("sucursal").not().isEmpty(),
		check("sucursal").custom(existeSucursal),
		validarChecks,
	],
	crearObjetivto
);

router.put(
	"/:id",
	[
		validarIdMongoose,
		verificarToken,
		verificarAdminRol,
		check("incremento")
			.not()
			.isEmpty()
			.isNumeric()
			.isLength({ min: 1, max: 3 }),
		validarChecks,
	],
	cambiarIncremento
);

module.exports = router;
