const { Router } = require("express");

const { check } = require("express-validator");

const {
	verificarToken,
	verificarAdminRol,
} = require("../middlewares/autenticacion");

const {
	validarIdMongoose,
	validarChecks,
} = require("../middlewares/validar-campos");

const {
	getSucursales,
	getSucursal,
	crearSucursal,
	modificarSucursal,
	eliminarSucursal,
} = require("../controllers/sucursal");

const router = Router();

router.get("/", [], getSucursales);

router.get("/:id", [validarIdMongoose], getSucursal);

router.post(
	"/",
	[
		verificarToken,
		verificarAdminRol,
		check("titulo").not().isEmpty(),
		check("codigosucursal").not().isEmpty(),
		check("direccion").not().isEmpty(),
		check("tel").not().isEmpty(),
		check("cel").not().isEmpty(),
		check("correo").not().isEmpty(),
		check("img").not().isEmpty(),
		validarChecks,
	],
	crearSucursal
);

router.put(
	"/:id",
	[
		validarIdMongoose,
		verificarToken,
		verificarAdminRol,
		check("titulo").not().isEmpty(),
		check("codigosucursal").not().isEmpty(),
		check("direccion").not().isEmpty(),
		check("tel").not().isEmpty(),
		check("cel").not().isEmpty(),
		check("correo").not().isEmpty(),
		check("img").not().isEmpty(),
		validarChecks,
	],
	modificarSucursal
);

router.delete(
	"/:id",
	[validarIdMongoose, verificarToken, verificarAdminRol],
	eliminarSucursal
);

module.exports = router;
