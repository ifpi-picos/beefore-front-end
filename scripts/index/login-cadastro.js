const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"
const buttonLogin = document.getElementById("button-login")
const buttonCriarConta = document.getElementById("button-criar-conta")

const forms = document.getElementById("forms")

const response = document.querySelector(".response")
const responseTitle = document.getElementById("response-title")
const responseText = document.getElementById("response-text")

const loading = document.getElementById("loading")

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

if (window.localStorage.getItem("token")) {
    document.location.href = "/dashboard.html"
}

buttonLogin.addEventListener("click", () => {
    if (buttonLogin.getAttribute("active") == "true") {
        loading.style = "display:flex"
        forms.style = "display:none;"

        const email = document.getElementById("input-login-email").value
        const senha = document.getElementById("input-login-senha").value

        if (!email || !email.match(/^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Email inválido"
            responseText.innerHTML = "Preencha corretamente os campos para realizar o login"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else if (!senha) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Senha faltando"
            responseText.innerHTML = "Preencha corretamente os campos para realizar o login"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else {
            fetch(apiURL + "/auth/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: senha
                })
            })
                .then(async (res) => {
                    if (res.status == 200) {
                        const data = await res.json()

                        window.localStorage.setItem("token", data.token)

                        let redirect = getCookie("redirect")
                        if (redirect) {
                            eraseCookie("redirect")
                            return document.location.href = redirect
                        }
                        else {
                            return document.location.href = "/dashboard.html"
                        }
                    }

                    loading.style = "display:none"
                    response.style = "display:flex;"
                    forms.style = "display:none;"

                    if (res.status == 400) {
                        responseTitle.innerHTML = "Dados faltando"
                        responseText.innerHTML = "Preencha corretamente os campos para realizar o login"

                        document.getElementById("button-confirm").addEventListener("click", () => {
                            response.style = "display:none;"
                            forms.style = "display:flex;"
                        })
                    }
                    else if (res.status == 401) {
                        document.getElementById("input-login-senha").value = ""
                        responseTitle.innerHTML = "Senha incorreta"
                        responseText.innerHTML = "Verifique sua senha e tente novamente"

                        document.getElementById("button-confirm").addEventListener("click", () => {
                            response.style = "display:none;"
                            forms.style = "display:flex;"
                        })
                    }
                    else if (res.status == 404) {
                        responseTitle.innerHTML = "Email não encontrado"
                        responseText.innerHTML = "Nenhuma conta com este email foi encontrada"

                        document.getElementById("button-confirm").addEventListener("click", () => {
                            response.style = "display:none;"
                            forms.style = "display:flex;"
                        })
                    }
                    else {
                        responseTitle.innerHTML = "Erro inesperado"
                        responseText.innerHTML = "Ocorreu um erro desconhecido, tente novamente"

                        document.getElementById("button-confirm").addEventListener("click", () => {
                            response.style = "display:none;"
                            forms.style = "display:flex;"
                        })
                    }
                })
                .catch(res => {
                    responseTitle.innerHTML = "Erro inesperado"
                    responseText.innerHTML = "Ocorreu um erro desconhecido, tente novamente"

                    document.getElementById("button-confirm").addEventListener("click", () => {
                        response.style = "display:none;"
                        forms.style = "display:flex;"
                    })
                })
        }
    }
    else {
        document.getElementById("form-title").innerText = "Login"

        buttonLogin.setAttribute("active", "true")
        buttonCriarConta.setAttribute("active", "false")

        buttonCriarConta.classList.remove("active-button")
        buttonCriarConta.classList.add("inactive-button")

        buttonLogin.classList.remove("inactive-button")
        buttonLogin.classList.add("active-button")

        document.getElementById("form-login").style = "display: flex;"
        document.getElementById("form-criar-conta").style = "display: none;"
    }
})

buttonCriarConta.addEventListener("click", () => {
    if (buttonCriarConta.getAttribute("active") == "true") {
        loading.style = "display:flex"
        forms.style = "display:none;"

        const nome = document.getElementById("input-criar-conta-nome").value
        const cartao = document.getElementById("input-criar-conta-cartao").value
        const ocupacao = document.getElementById("input-criar-conta-ocupacao").value
        const email = document.getElementById("input-criar-conta-email").value
        const senha = document.getElementById("input-criar-conta-senha").value

        const confirmarSenha = document.getElementById("input-criar-conta-confirmar-senha").value

        if (!nome || !nome.match(/^[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,}(?: [a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+){0,8}$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Nome inválido"
            responseText.innerHTML = "Preencha corretamente o campo para realizar o cadastro"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else if (!cartao || !cartao.match(/(^(\d){10})$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "ID do cartão inválido"
            responseText.innerHTML = "O ID do cartão são os últimos 10 dígitos do número na parte de trás do seu crachá"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else if (ocupacao && !ocupacao.match(/^[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]{2,}(?: [a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+){0,8}$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Ocupação inválida"
            responseText.innerHTML = "Preencha corretamente o campo para realizar o cadastro"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else if (!email || !email.match(/^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g)) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Email inválido"
            responseText.innerHTML = "Preencha corretamente o campo para realizar o cadastro"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else if (!senha || senha.length < 8) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Senha inválida"
            responseText.innerHTML = "Sua senha precisa ter no mínimo 8 caracteres"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else if (senha != confirmarSenha) {
            loading.style = "display:none"
            response.style = "display:flex;"
            forms.style = "display:none;"

            responseTitle.innerHTML = "Senha inválida"
            responseText.innerHTML = "A senha não coincide com a confirmação"

            document.getElementById("button-confirm").addEventListener("click", () => {
                response.style = "display:none;"
                forms.style = "display:flex;"
            })
        }
        else {
            fetch(apiURL + "/user/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nome,
                    occupation: ocupacao,
                    cardid: cartao,
                    email: email,
                    password: senha,
                    type: "Member",
                })
            })
                .then(res => {
                    loading.style = "display:none"
                    response.style = "display:flex;"
                    forms.style = "display:none;"

                    if (res.status == 201) {
                        responseTitle.innerHTML = "Sucesso"
                        responseText.innerHTML = "Você poderá utilizar sua conta assim que for aprovada por um coordenador"

                        document.getElementById("button-confirm").addEventListener("click", () => {
                            document.location.href = "/"
                        })
                    }
                    else if (res.status == 400) {
                        res.json()
                            .then(data => {
                                responseTitle.innerHTML = data.error
                                responseText.innerHTML = "Corrija o erro e tente novamente"

                                document.getElementById("button-confirm").addEventListener("click", () => {
                                    response.style = "display:none;"
                                    forms.style = "display:flex;"
                                })
                            })
                    }
                    else {
                        responseTitle.innerHTML = "Erro inesperado"
                        responseText.innerHTML = "Ocorreu um erro desconhecido, tente novamente"

                        document.getElementById("button-confirm").addEventListener("click", () => {
                            response.style = "display:none;"
                            forms.style = "display:flex;"
                        })
                    }
                })
                .catch(res => {
                    responseTitle.innerHTML = "Erro inesperado"
                    responseText.innerHTML = "Ocorreu um erro desconhecido, tente novamente"

                    document.getElementById("button-confirm").addEventListener("click", () => {
                        response.style = "display:none;"
                        forms.style = "display:flex;"
                    })
                })
        }
    }
    else {
        document.getElementById("form-title").innerText = "Criar Conta"

        buttonCriarConta.setAttribute("active", "true")
        buttonLogin.setAttribute("active", "false")

        buttonLogin.classList.remove("active-button")
        buttonLogin.classList.add("inactive-button")

        buttonCriarConta.classList.add("active-button")
        buttonCriarConta.classList.remove("inactive-button")

        document.getElementById("form-login").style = "display: none;"
        document.getElementById("form-criar-conta").style = "display: flex;"
    }
})
