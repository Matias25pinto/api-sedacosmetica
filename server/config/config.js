/*
=======================
+++++PUERTO++++++++++++
=======================
*/
process.env.PORT = process.env.PORT || 3000;
/*
=======================
+++++TOKEN++++++++++++
=======================
*/
process.env.SEED = process.env.SEED | "2020NODEJOS-matias-pinto";
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN | "60*60*24";

/*
=======================
+++++Base de datos+++++
=======================
*/

process.env.NODE_ENV = process.env.NODE_ENV || "Dev";

let urlBD;

if (false) {
  urlBD = "mongodb://localhost/sedaCosmetico";
} else {
  urlBD =
    "mongodb+srv://matias25pinto:aspire5734z@cluster0.hmxoq.mongodb.net/sedaCosmetico?retryWrites=true&w=majority";
}

process.env.URLDB = urlBD;
