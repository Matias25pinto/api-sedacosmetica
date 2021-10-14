const sqlConfig = {
  user: "consulta",
  password: "Consulta",
  database: "GESCOM",
  server: "181.127.188.12",
  port: 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

module.exports = sqlConfig;
