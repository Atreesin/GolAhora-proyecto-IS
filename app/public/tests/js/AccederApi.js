const API_LOGIN = "https://golahora-proyecto-is.onrender.com/api/login";


document.getElementById("login").addEventListener("submit", async (evento) => {
    evento.preventDefault(); // Frenamos la recarga automática

    // Capturamos los datos en el momento exacto del clic
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    
    try {
        const Respuesta = await fetch(API_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "plataform": "web" // les falto esto
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: "include" // y esto
        });

        // Si la API responde con un error (ej: status 400 o 401)
        
        if (!Respuesta.ok) {
            throw new Error("El correo o la contraseña son incorrectos.");
        }

        // Si la API responde OK, procesamos el JSON
        // const datos = await Respuesta.json(); // tamnpoco es necesario
        
        // Guardamos el token en la memoria local
        //localStorage.setItem("token", datos.token);  // no hace falta, se encarga la api

        alert("¡Ingreso exitoso!");
        
        // Redirigimos a la interfaz de usuario
        window.location.href = "InterfazCliente.html"; // la api envia un link de redireccionamiento se puede hacer asi
       /*
        const resJson = await res.json();
        if(resJson.redirect){
        window.location.href = resJson.redirect;
        }
        */

    } catch (error) {
        // Si hay error de contraseña o de red, salta acá
        alert(error.message);
        console.error("Error detectado:", error);
    }
});
