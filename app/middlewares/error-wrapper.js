export function ejecutarConManejoDeErrores(controllerFn) {
  return async (req, res, next) => {
    try {
      await controllerFn(req, res, next);
      
      
    } catch (err) {
      console.error(err);
      console.log(err.message)
      if (err.message.includes("Cannot read properties of undefined ")) {
        return res.status(400).send({
          status: "Error",
          message: err.message || "Faltan campos obligatorios en la solicitud"
        });
      }
      
      if (err.status) {
        return res.status(err.status).send({ status: "Error", message: err.message });
      }

      return res.status(500).send({ status: "Error", message: "Error interno del servidor" });
    }
  };
}