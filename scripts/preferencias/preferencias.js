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
    const inputCartao = document.getElementById("input-preferencias-cartao")
    const inputOcupacao = document.getElementById("input-preferencias-funcao")
    const inputImagem = document.getElementById("input-preferencias-imagem")
    const inputSenha = document.getElementById("input-preferencias-senha")
    const checkComprovante = document.getElementById("comprovante")

    inputNome.value = user.name
    inputCartao.value = user.cardid
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
                cardid: inputCartao.value != user.cardid ? inputCartao.value : undefined,
                occupation: inputOcupacao.value != user.occupation ? inputOcupacao.value : undefined,
                profileimage: inputImagem.value != user.profileimage ? inputImagem.value : undefined,
                password: inputSenha.value != "" ? inputSenha.value : undefined,
                preferences: checkComprovante.checked != user.preferences.sendActionReg ? { sendActionReg: checkComprovante.checked } : undefined
            }
        }

        if (newUserInfo.modify.profileimage == "" && user.profileimage == undefined) {
            newUserInfo.modify.profileimage = undefined
        }

        if (!newUserInfo.modify.name && !newUserInfo.modify.cardid && !newUserInfo.modify.occupation && !newUserInfo.modify.password && !newUserInfo.modify.preferences && newUserInfo.modify.profileimage === undefined) {
            return
        }

        forms.style.display = "none"
        loading.style.display = "flex"

        if (newUserInfo.modify.name && !newUserInfo.modify.name.match(/^[a-zA-Za-z??????????????????????????????????????????????????????????????]{2,}(?: [a-zA-Za-z??????????????????????????????????????????????????????????????]+){0,8}$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Nome inv??lido"
            responseText.innerHTML = "Preencha corretamente o campo para realizar o cadastro"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.cardid && !newUserInfo.modify.cardid.match(/(^(\d){10})$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "ID do cart??o inv??lido"
            responseText.innerHTML = "O ID do cart??o s??o os ??ltimos 10 d??gitos do n??mero na parte de tr??s do seu crach??"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.occupation && !newUserInfo.modify.occupation.match(/^[a-zA-Za-z??????????????????????????????????????????????????????????????-]{2,}(?: [a-zA-Za-z??????????????????????????????????????????????????????????????-]+){0,8}$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Ocupa????o inv??lida"
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

            responseTitle.innerHTML = "URL de imagem inv??lido"
            responseText.innerHTML = "Este n??o ?? um URL v??lido para uma imagem"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.password && newUserInfo.modify.password.length < 8) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Senha inv??lida"
            responseText.innerHTML = "Sua senha precisa ter no m??nimo 8 caracteres"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:block;"
            })
        }
        else if (newUserInfo.modify.password && newUserInfo.modify.password != document.getElementById("input-preferencias-confirmar-senha").value) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Senha inv??lida"
            responseText.innerHTML = "A senha n??o coincide com a confirma????o"

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

                responseTitle.innerHTML = "Erro de valida????o"
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
                responseText.innerHTML = "Um erro desconhecido ocorreu, clique no bot??o abaixo para recarregar a p??gina"

                document.getElementById("button-confirm").addEventListener("click", () => {
                    document.location.reload()
                })
            }
        }
    })
}
