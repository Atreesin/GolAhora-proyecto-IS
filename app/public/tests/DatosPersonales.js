const API = "https://golahora-proyecto-is.onrender.com/api/user_info";

async function ObtenerDatosPersonales(){
    try{
        //Con fetch hago la peticion a mi servidor pasando por la api,y en respuesta se almacena la respuesta que es el encabezado con el estado y el body con los datos.
        const Respuesta = await fetch(API);
        // accedo al body,lo transformo en un json con el que puedo trabajar y lo guardo en datos.
        const Datos = await Respuesta.json();
        //Busco los campos en mi html
        const CampoNombre = document.querySelector('.input-Nombre');
        const CampoApellido = document.querySelector('.input-Apellido');
        const CampoDni = document.querySelector('.input-Dni');
        const CampoNacionalidad = document.querySelector('.input-Nacionalidad');
        const CampoGenero = document.querySelector('.input-Genero');
        const CampoFecha = document.querySelector('.input-Fecha');
        const CampoEmail = document.querySelector('.input-Email');
        const CampoTelefono = document.querySelector('.input-Telefono');
        const CampoDireccion = document.querySelector('.input-Direccion');

        // conecto los campos con mi DB
        CampoNombre.value = Datos.nombre || "";
        CampoApellido.value = Datos.apellido || "";
        CampoDni.value = Datos.dni || "";
        CampoNacionalidad.value = Datos.nacionalidad || "";
        CampoGenero.value = Datos.genero || "";
        CampoTelefono.value = Datos.telefono || "";
        CampoEmail.value = Datos.email || "";

    }catch(error){

    };
  
}  ObtenerDatosPersonales();