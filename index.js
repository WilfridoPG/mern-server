const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
//crear el servidor
const app = express();
//conectar la base de datos
conectarDB();
//habilitar cors
app.use(cors());
//habilitar expres json
app.use(express.json({ extended: true }));
//puerto de la app
const PORT = process.env.PORT || 4000;
//importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));
//arrancar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});
