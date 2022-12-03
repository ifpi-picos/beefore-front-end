const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"
const inputNome = document.getElementById("input-registro-nome")
const inputIcone = document.getElementById("input-registro-icone")

const loading = document.getElementById("loading")

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

async function searchMembers() {
    loading.style.display = "flex"
    const search = new URLSearchParams()
    search.set("name", inputNome.value)

    const res = await fetch(apiURL + "/user?" + search, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": window.localStorage.getItem("token")
        }
    })

    loading.style.display = "none"

    const title = document.querySelector(".box-registro-title")
    if (res.status == 200) {
        const boxRegistros = document.querySelector(".box-registros")
        boxRegistros.innerHTML = ""
        const data = await res.json()

        if (data.length > 0) {
            title.innerText = `${data.length} usuário${data.length > 1 ? "s" : ""} encontrado${data.length > 1 ? "s" : ""}`

            Object.values(data).forEach(user => {
                const redirect = document.createElement("a")
                redirect.href = `/registros.html?id=${user.id}&nome=${user.name}&query=${inputNome.value}`

                const box = document.createElement("div")
                box.classList.add("box")

                const perfil = document.createElement("div")
                perfil.classList.add("perfil-registro")

                const img = document.createElement("img")
                img.src = user.profileimage || "/assets/perfil.png"
                img.alt = `Foto de perfil do membro ${user.name}`
                img.id = "foto-perfil-registro"

                perfil.appendChild(img)

                const linhaVertical = document.createElement("div")
                linhaVertical.id = "linha-vertical"

                const identificacao = document.createElement("div")
                identificacao.classList.add("identificacao-usuario")
                identificacao.innerHTML = `
                <h2>Nome: ${user.name}</h2>
                ${user.occupation ? `<h2>Função: ${user.occupation}</h2>` : ""}
                <h2>Cartão: ${user.cardid}</h2>
                `

                box.appendChild(perfil)
                box.appendChild(linhaVertical)
                box.appendChild(identificacao)
                redirect.appendChild(box)
                boxRegistros.appendChild(redirect)

            })
        }
        else {
            title.innerText = `Nenhum usuário com o nome "${inputNome.value}" encontrado`
        }
    }
    else if (res.status == 500) {
        title.innerText = `Um erro inesperado ocorreu, tente novamente mais tarde`
    }
}

inputNome.addEventListener("keypress", async (e) => {
    if (e.code == "Enter" || e.code == "NumpadEnter") {
        if (inputNome.value != "") {
            await searchMembers()
        }
    }
})

inputIcone.addEventListener("click", async () => {
    if (inputNome.value != "") {
        await searchMembers()
    }
})

if (params.query) {
    inputNome.value = params.query
    inputIcone.dispatchEvent(new Event("click"))
}
