const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
//crear una tareas
//api/tareas
router.post(
  "/",
  auth,
  [check("nombre", "El nombre es obligatorio").not().isEmpty()],
  [check("proyecto", "El proyecto es obligatorio").not().isEmpty()],
  tareaController.createTarea
);
//obtener las tareas por proyecto
router.get("/", auth, tareaController.obtenerTareas);
//acutalizar tareas
router.put("/:id", auth, tareaController.actualizarTarea);
//Eliminar  tareas
router.delete("/:id", auth, tareaController.eliminarTarea);
module.exports = router;
