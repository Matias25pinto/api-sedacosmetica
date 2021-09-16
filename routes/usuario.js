const { Router } = require("express");

const { check } = require("express-validator");

const { verificarToken } = require("../middlewares/autenticacion");
const { getUsuarios, getUsuario, login } = require("../controllers/usuario");
const { validarChecks, validarIdMongoose } = require("../middlewares/validar-campos");
const { existeEmail } = require("../helpers/validar-bd");
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
router.get("/", [verificarToken], getUsuarios);

router.get("/usuario/:id", [verificarToken, validarIdMongoose], getUsuario);

module.exports = router;
