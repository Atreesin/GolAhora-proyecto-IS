const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit",async (e)=>{
    e.preventDefault();
    const email = e.target.children.email.value;
    const password = e.target.children.password.value;
    const res = await fetch("/api/login",{
        method: "POST",
        headers:{
            "content-Type":"application/json",
            "plataform":"web"
        },
        body: JSON.stringify({
            email, password
        })
    });
    if(!res.ok) return mensajeError.classList.toggle("escondido",false);
    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
})