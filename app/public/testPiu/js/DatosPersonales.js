const API = "https://golahora-proyecto-is.onrender.com/api/user_info";

async function ObtenerDatosPersonales(){
    try{
       const Respuesta = await fetch(API,{
        method : "GET",
        headers : {
            "Content-type":"aplication/JSON",
            "plataform": "web"
        }
       });
       const Datos = await Respuesta.json();
       
        const CampoNombre = document.querySelector('.input-Nombre');
        const CampoApellido = document.querySelector('.input-Apellido');
        const CampoNacionalidad = document.querySelector('.input-Nacionalidad');
        const CampoDni = document.querySelector('.input-Dni');
        const CampoGenero = document.querySelector('.input-Genero');
        const CampoFecha = document.querySelector('.input-Fecha');
        const CampoEmail = document.querySelector('.input-Email');
        const CampoTelefono = document.querySelector('.input-Telefono');
        const CampoDireccion = document.querySelector('.input-Direccion');

        // conecto los campos con mi DB
        CampoNombre.value = Datos.nombre ;
        CampoApellido.value = Datos.apellido;
        CampoNacionalidad.value = Datos.nacionalidad;
        CampoDni.value = Datos.dni;
        CampoGenero.value = Datos.genero;
        CampoTelefono.value = Datos.telefono;
        CampoEmail.value = Datos.email;

    }catch(error){

    };
  
}  ObtenerDatosPersonales();