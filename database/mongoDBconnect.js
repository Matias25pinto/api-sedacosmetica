const mongoose = require("mongoose");
// Conectar a MongoDB
const mongoDB = async () => {
  await mongoose.connect(
    process.env.URLMONGODB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    (err, res) => {
      if (err) throw new err();

      console.log("Conectado a la Base de datos Seda Cosmética");
    }
  );
};

module.expots = { mongoDB };
