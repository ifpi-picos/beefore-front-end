const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

if (window.localStorage.getItem("dev") == "true" || document.location.host != "127.0.0.1:5500") {
    const res = await fetch(apiURL + "/user/", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('token')
        }
    })

    if (res.status == 200) {
        const user = await res.json()

        if (user.type == "Coordinator") {
            document.getElementById("button-registros-usuarios").style.display = "inherit"
            document.getElementById("button-autorizacoes").style.display = "inherit"
        }

        document.getElementById("nome").innerHTML = `<h1>${user.name}</h1>`
        if (user.profileimage) {
            document.getElementById("foto-perfil").setAttribute("src", user.profileimage)
        }

        document.querySelector("main").style.display = "flex"
    }
    else {
        document.location.href = "/"
    }
}

const buttonSair = document.getElementById("button-sair")

buttonSair.addEventListener("click", () => {
    window.localStorage.removeItem("token")
    document.location.href = "/"
})
