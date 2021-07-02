const { Router } = require("express");

const { iniciarSesion } = require("../controllers/login");

const router = Router();

router.post("/iniciar-sesion", [], iniciarSesion);

module.exports = router;
