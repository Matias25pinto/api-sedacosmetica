const { Router } = require("express");

const { iniciarSesion, loginVerificar } = require("../controllers/login");
const { verificarToken } = require("../middlewares/autenticacion");
const router = Router();

router.post("/iniciar-sesion", [], iniciarSesion);

router.get("/verificar", [verificarToken], loginVerificar);

module.exports = router;
