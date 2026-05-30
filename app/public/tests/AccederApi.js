const API_LOGIN = "https://golahora-proyecto-is.onrender.com/api/login";

document.getElementById("login").addEventListener("submit", async (evento) => {
    evento.preventDefault(); 

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const Respuesta = await fetch(API_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                email: email,
                password: password
            })   
        });

        if (!Respuesta.ok) {
            throw new Error("El correo o la contraseña son incorrectos.");
        }
        
        const datos = await Respuesta.json();
        console.log("JSON recibido en Login:", datos); // Para verificar qué llega

        // 1.  Guardamos el token para que la otra pantalla pueda usarlo
        if (datos.token) {
            localStorage.setItem("token", datos.token);
        } else {
            
            console.warn("La API no devolvió un campo 'token'.");
        }
    
        alert("¡Ingreso exitoso!");
        
        
        const nivelUsuario = datos.user_level;

        // 3. Evaluamos con los valores exactos
        if (nivelUsuario === "Administrador") {
            window.location.href = "InterfazAdministrador.html";
        } else if(nivelUsuario==="Cliente") {
            
            window.location.href = "InterfazCliente.html";
        }

    } catch (error) {
        alert(error.message);
        console.error("Error detectado:", error);
    }
});