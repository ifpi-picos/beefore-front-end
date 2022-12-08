import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"
const qrcodeImg = document.getElementById("qrcode")
const actionRegText = document.getElementById("actionReg")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

try {
    const res = await fetch(apiURL + "/relatory/code", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": window.localStorage.getItem("token")
        }
    })

    if (res.status == 200) {
        const data = await res.json()

        qrcodeImg.src = data.qrcode


        const socket = io(apiURL, {
            extraHeaders: {
                Authorization: window.localStorage.getItem("token")
            }
        });

        socket.on("refreshQRCode", (data) => {
            qrcodeImg.src = data.qrcode
        })

        socket.on("actionReg", async (data) => {
            console.log(data)
            actionRegText.innerText = `${data.action} registrada com sucesso para o usuário ${data.name}`

            setTimeout(() => {
                actionRegText.innerText = ""
            }, 10000)
        })
    }
    else if (res.status == 403 || res.status == 401) {
        document.location.href = "/"
    }
    else {
        await sleep(2000)
        document.location.reload()
    }
}
catch (err) {
    await sleep(2000)
    document.location.reload()
}