const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

const res = await fetch(apiURL + "/authorization/", {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": window.localStorage.getItem("token")
    }
})

if (res.status == 200) {
    const data = await res.json()

    if (data.length > 0) {
        const boxAutorizacao = document.querySelector(".box-autorizacao")
        data.forEach(authorization => {
            const box = document.createElement("div")
            box.classList.add("box")

            const authorizationType = document.createElement("h2")
            authorizationType.id = "authorization-type"
            authorizationType.innerText = "Cadastro de Membro"

            const identificacaoAutorizacao = document.createElement("div")
            identificacaoAutorizacao.classList.add("identificacao-autorizacao")
            identificacaoAutorizacao.innerHTML = `
                <h2>Nome: ${authorization.data.name}</h2>
                ${authorization.data.occupation ? `<h2>Função: ${authorization.data.occupation}</h2>` : ""}
                <h2>Cartão: ${authorization.data.cardid}</h2>
                `
            box.appendChild(authorizationType)

            box.innerHTML += `<div id="linha"></div>
                <div id="linha-mobile"></div>`

            box.appendChild(identificacaoAutorizacao)

            box.innerHTML += `<div id="linha"></div>
                <div id="linha-mobile"></div>`

            box.innerHTML += `<div class="buttons">
                <button id="button-aprovar" authorizationid="${authorization.id}">Aprovar</button>
                <button id="button-rejeitar" authorizationid="${authorization.id}">Rejeitar</button>
            </div>`

            boxAutorizacao.appendChild(box)
        })

        const buttonsAprovar = document.querySelectorAll("#button-aprovar")
        const buttonsRejeitar = document.querySelectorAll("#button-rejeitar")

        for (let i in buttonsAprovar) {
            if (parseInt(i) || i == "0") {
                buttonsAprovar[i].addEventListener("click", async () => {
                    const authId = buttonsAprovar[i].getAttribute("authorizationid")

                    const res = await fetch(apiURL + "/authorization/", {
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": window.localStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            id: authId,
                            status: "Approved"
                        })
                    })

                    const buttonBox = buttonsAprovar[i].parentElement

                    if (res.status == 200) {
                        buttonBox.innerHTML = `<h3>Autorização aprovada com sucesso</h3>`
                    }
                    else {
                        const data = await res.json()
                        buttonBox.innerHTML = `<h3>${data.error}</h3>`
                    }
                })

                buttonsRejeitar[i].addEventListener("click", async () => {
                    const authId = buttonsAprovar[i].getAttribute("authorizationid")

                    const res = await fetch(apiURL + "/authorization/", {
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": window.localStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            id: authId,
                            status: "Denied"
                        })
                    })

                    const buttonBox = buttonsAprovar[i].parentElement

                    if (res.status == 200) {
                        buttonBox.innerHTML = `<h3>Autorização rejeitada com sucesso</h3>`
                    }
                    else {
                        const data = await res.json()
                        buttonBox.innerHTML = `<h3>${data.error}</h3>`
                    }
                })
            }
        }
    }
    else {
        const title = document.querySelector(".container-autorizacao .title h1")
        title.innerText = "Nenhum item para ser autorizado"
    }
}
else if (res.status == 403) {
    document.location.href = "/"
}
else {
    document.location.reload()
}