const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

const res = await fetch(apiURL + "/user/", {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": window.localStorage.getItem("token")
    }
})

if (res.status == 200) {
    const forms = document.querySelector(".forms")
    const loading = document.getElementById("loading")
    const response = document.querySelector(".response")
    const responseTitle = document.getElementById("response-title")
    const responseText = document.getElementById("response-text")

    const user = await res.json()

    const inputNome = document.getElementById("input-preferencias-nome")
    const inputOcupacao = document.getElementById("input-preferencias-funcao")
    const inputImagem = document.getElementById("input-preferencias-imagem")
    const inputSenha = document.getElementById("input-preferencias-senha")
    const checkComprovante = document.getElementById("comprovante")

    inputNome.value = user.name
    inputOcupacao.value = user.occupation
    inputImagem.value = user.profileimage

    if (user.telegramid) {
        if (user.preferences.sendActionReg) {
            checkComprovante.checked = true
        }
        else {
            checkComprovante.checked = false
        }
    }
    else {
        checkComprovante.disabled = true
    }

    document.getElementById("button-confirmar").addEventListener("click", async () => {
        const newUserInfo = {
            modify: {
                name: inputNome.value != user.name ? inputNome.value : undefined,
                occupation: inputOcupacao.value != user.occupation ? inputOcupacao.value : undefined,
                profileimage: inputImagem.value != user.profileimage ? inputImagem.value : undefined,
                password: inputSenha.value != "" ? inputSenha.value : undefined,
                preferences: checkComprovante.checked != user.preferences.sendActionReg ? { sendActionReg: checkComprovante.checked } : undefined
            }
        }

        if (newUserInfo.modify.profileimage == "" && user.profileimage == undefined) {
            newUserInfo.modify.profileimage = undefined
        }

        if (!newUserInfo.modify.name && !newUserInfo.modify.occupation && !newUserInfo.modify.password && !newUserInfo.modify.preferences && newUserInfo.modify.profileimage === undefined) {
            return
        }

        forms.style.display = "none"
        loading.style.display = "flex"

        if (newUserInfo.modify.name && !newUserInfo.modify.name.match(/^[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,}(?: [a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+){0,8}$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Nome inválido"
            responseText.innerHTML = "Preencha corretamente o campo para realizar o cadastro"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.occupation && !newUserInfo.modify.occupation.match(/^[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]{2,}(?: [a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+){0,8}$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Ocupação inválida"
            responseText.innerHTML = "Preencha corretamente o campo para realizar o cadastro"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.profileimage && !newUserInfo.modify.profileimage.match(/(http)?s?:?(\/\/[^""]*\.(?:png|jpg|jpeg|gif|png|svg))/i)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "URL de imagem inválido"
            responseText.innerHTML = "Este não é um URL válido para uma imagem"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.password && newUserInfo.modify.password.length < 8) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Senha inválida"
            responseText.innerHTML = "Sua senha precisa ter no mínimo 8 caracteres"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.password && newUserInfo.modify.password != document.getElementById("input-preferencias-confirmar-senha").value) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Senha inválida"
            responseText.innerHTML = "A senha não coincide com a confirmação"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else {
            const res = await fetch(apiURL + "/user/", {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": window.localStorage.getItem("token")
                },
                body: JSON.stringify(newUserInfo)
            })

            if (res.status == 200) {
                document.location.reload()
            }
            else if (res.status == 400) {
                const data = await res.json()

                loading.style = "display:none"
                response.style = "display:flex;"
                forms.style = "display:none;"

                responseTitle.innerHTML = "Erro de validação"
                responseText.innerHTML = data.error

                document.getElementById("button-confirm").addEventListener("click", () => {
                    response.style = "display:none;"
                    forms.style = "display:block;"
                })
            }
            else {
                loading.style = "display:none"
                response.style = "display:flex;"
                forms.style = "display:none;"

                responseTitle.innerHTML = "Erro desconhecido"
                responseText.innerHTML = "Um erro desconhecido ocorreu, clique no botão abaixo para recarregar a página"

                document.getElementById("button-confirm").addEventListener("click", () => {
                    document.location.reload()
                })
            }
        }
    })
}
