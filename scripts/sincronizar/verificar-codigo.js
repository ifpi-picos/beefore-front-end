const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const codeFields = document.querySelectorAll("#form-codigo input")

if (params.code && params.code.match(/[0-9]{6}/g)) {
    codeFields.forEach((field, index) => {
        field.value = params.code[index]
    })
}

const sideSincronizar = document.getElementById("side-sincronizar")

const buttonConfirmar = document.getElementById("button-confirmar")

const loading = document.getElementById("loading")
const response = document.querySelector(".response")
const responseTitle = document.getElementById("response-title")
const responseText = document.getElementById("response-text")

buttonConfirmar.addEventListener("click", () => {
    let validation = true
    let code = ""

    codeFields.forEach(field => {
        if (field.value.match(/[0-9]{1}/)) {
            code += field.value
        }
        else {
            validation = false
        }
    })

    if (validation) {
        loading.style = "display:flex"
        sideSincronizar.style = "display:none;"

        fetch(apiURL + "/auth/sincronizar", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                code: code
            })
        })
            .then(res => {
                loading.style = "display:none"
                response.style = "display:flex;"
                sideSincronizar.style = "display:none;"

                if (res.status == 200) {
                    responseTitle.innerHTML = "Telegram sincronizado com sucesso"
                    responseText.innerHTML = "Sua conta foi sincronizada com sucesso"

                    document.getElementById("button-confirm").addEventListener("click", () => {
                        response.style = "display:none;"
                        sideSincronizar.style = "display:flex;"
                        document.location.href = "/dashboard.html"
                    })
                }
                else if (res.status == 400) {
                    responseTitle.innerHTML = "Código faltando ou inválido"
                    responseText.innerHTML = "O código está faltando ou é inválido"

                    document.getElementById("button-confirm").addEventListener("click", () => {
                        response.style = "display:none;"
                        sideSincronizar.style = "display:flex;"
                    })
                }
                else if (res.status == 401) {
                    responseTitle.innerHTML = "Usuário não autenticado"
                    responseText.innerHTML = "Faça login e tente novamente"

                    document.getElementById("button-confirm").addEventListener("click", () => {
                        response.style = "display:none;"
                        sideSincronizar.style = "display:flex;"
                        document.location.href = "/"
                    })
                }
                else if (res.status == 404) {
                    responseTitle.innerHTML = "Código não encontrado"
                    responseText.innerHTML = "O código inserido não existe ou está expirado"

                    document.getElementById("button-confirm").addEventListener("click", () => {
                        response.style = "display:none;"
                        sideSincronizar.style = "display:flex;"
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
    }
})