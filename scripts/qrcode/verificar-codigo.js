const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"
const messageTitle = document.getElementById("message-title")
const messageText = document.getElementById("message-text")
const loading = document.getElementById("loading")

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

if (params.code) {
    const res = await fetch(apiURL + "/relatory/code/" + params.code, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": window.localStorage.getItem("token")
        }
    })

    if (res.status == 200) {
        loading.style.display = "none"
        messageTitle.innerText = "Ação registrada com sucesso"
        messageText.innerText = "Esta aba já pode ser encerrada"
    }
    else if (res.status == 401) {
        loading.style.display = "none"
        messageTitle.innerText = "Código incorreto"
        messageText.innerText = "Escaneie o QR Code novamente"
    }
    else if (res.status == 400) {
        loading.style.display = "none"
        messageTitle.innerText = "Usuário não encontrado"
        messageText.innerText = "Tente fazer login no sistema novamente"
    }
    else {
        loading.style.display = "none"
        messageTitle.innerText = "Erro desconhecido"
        messageText.innerText = "Tente novamente em alguns instantes"
    }
}
else {
    loading.style.display = "none"
    messageTitle.innerText = "Código não encontrado"
    messageText.innerText = "Escaneie o QR Code novamente"
}