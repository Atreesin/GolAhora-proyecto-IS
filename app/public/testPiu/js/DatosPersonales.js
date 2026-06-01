const API = "https://golahora-proyecto-is.onrender.com/api/user_info/Full_info";

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
        console.log(Datos);
       
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
        CampoNombre.value = Datos.nombre ;
        CampoApellido.value = Datos.apellido;
        CampoDni.value = Datos.dni;
        CampoNacionalidad.value = Datos.nacionalidad;
        CampoGenero.value = Datos.genero;
        CampoFecha.value = Datos.fecha_nacimiento;
        CampoTelefono.value = Datos.telefono;
        CampoEmail.value = Datos.email;
        CampoDireccion.value = `${Datos.direccion.calle} ${Datos.direccion.numero}, ${Datos.direccion.localidad}, ${Datos.direccion.pais}`;
    }catch(error){
        console.error("Hubo un error al obtener los datos:", error);
    };
  
}  ObtenerDatosPersonales();
