const { Router } = require("express");

const { check } = require("express-validator");

const {
	verificarToken,
	verificarAdminRol,
} = require("../middlewares/autenticacion");

const {
	verificarEmail,
	verificarCedula,
} = require("../middlewares/validar-usuario");

const {
	getUsuarios,
	getUsuario,
	login,
	crearUsuario,
	modificarUsuario,
	eliminarUsuario,
	cambiarPassword,
} = require("../controllers/usuario");
const {
	validarChecks,
	validarIdMongoose,
} = require("../middlewares/validar-campos");
const {
	existeEmail,
	existeRole,
	existeSucursal,
} = require("../helpers/validar-bd");
const router = Router();

router.post(
	"/login",
	[
		check("email").isEmail(),
		check("email").custom(existeEmail),
		check("password").isLength({ min: 6 }),
		validarChecks,
	],
	login
);
router.put(
	"/cambiar-password/:id",
	[
		verificarToken,
		verificarAdminRol,
		validarIdMongoose,
		check("password").not().isEmpty(),
		validarChecks,
	],
	cambiarPassword
);

router.put(
	"/:id",
	[
		verificarToken,
		verificarAdminRol,
		validarIdMongoose,
		verificarEmail,
		verificarCedula,
		check("nombre").not().isEmpty(),
		check("apellido").not().isEmpty(),
		check("cedula").not().isEmpty(),
		check("celular").not().isEmpty(),
		check("email").isEmail().not().isEmpty(),
		check("role").custom(existeRole),
		check("sucursal").custom(existeSucursal),
		check("precios").not().isEmpty(),
		check("deposito").not().isEmpty(),
		validarChecks,
	],
	modificarUsuario
);
router.get("/", [verificarToken], getUsuarios);

router.get("/usuario/:id", [verificarToken, validarIdMongoose], getUsuario);

router.post(
	"/",
	[
		verificarToken,
		verificarAdminRol,
		verificarEmail,
		verificarCedula,
		check("nombre").not().isEmpty(),
		check("apellido").not().isEmpty(),
		check("cedula").not().isEmpty(),
		check("celular").not().isEmpty(),
		check("email").isEmail().not().custom(existeEmail),
		check("password").not().isEmpty().isLength({ min: 8 }),
		check("role").custom(existeRole),
		check("sucursal").custom(existeSucursal),
		check("precios").not().isEmpty(),
		check("deposito").not().isEmpty(),
		validarChecks,
	],
	crearUsuario
);

router.delete(
	"/:id",
	[verificarToken, verificarAdminRol, validarIdMongoose],
	eliminarUsuario
);

module.exports = router;
