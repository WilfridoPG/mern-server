const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
//crea un nueva  tarea
exports.createTarea = async (req, res) => {
  //revisar que no haya error
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer el proyecto y comprobar que existe
  try {
    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //revisar que el proyecto actual pertenece el usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    //crear tareas
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //llega los datos por params
    const { proyecto } = req.query;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    //revisar que el proyecto actual pertenece el usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    //obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//actualizar una tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //Extraer datos de proyecto
    const { proyecto, nombre, estado } = req.body;
    //si tarea existe
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "No existe esa tarea" });
    }
    const existeProyecto = await Proyecto.findById(proyecto);
    //revisar que el proyecto actual pertenece el usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    //crear un objeto con la nueva informacion
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;
    //guardar la tarea
    tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//elimina una tarea
exports.eliminarTarea = async (req, res) => {
  try {
    //Extraer datos de proyecto {params}
    const { proyecto } = req.query;
    //si tarea existe
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "No existe esa tarea" });
    }
    const existeProyecto = await Proyecto.findById(proyecto);
    //revisar que el proyecto actual pertenece el usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    //Eliminar
    await Tarea.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
