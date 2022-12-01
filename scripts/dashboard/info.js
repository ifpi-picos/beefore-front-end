import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

if (window.localStorage.getItem("dev") == "true" || document.location.host != "127.0.0.1:5500") {
    const res = await fetch(apiURL + "/actualUsage/statistics", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('token')
        }
    })

    if (res.status == 200) {
        const data = await res.json()

        const actualUsageDisplay = document.getElementById("utilizacao-atual")
        const mostUsedDayDisplay = document.getElementById("dia-mais-uso")
        const averageUsageDisplay = document.getElementById("utilizacao-media")

        const days = {
            "segunda-feira": "2° Feira",
            "terça-feira": "3° Feira",
            "quarta-feira": "4° Feira",
            "quinta-feira": "5° Feira",
            "sexta-feira": "6° Feira",
            "sábado": "Sábado",
            "domingo": "Domingo",
        }

        let mostUsedDay = days[luxon.DateTime.fromFormat(data.mostUsedDay, "dd/LL/yyyy").setLocale("br").toFormat("cccc")]

        let averageUsage = data.averageTimeUsage
        let type = "Hora"
        if (averageUsage < 1) {
            averageUsage *= 60
            type = "Minuto"
        }

        function round(n) {
            var n = n.toString()
            n = n.split(".")
            var nI = n[0]
            var nP = n[1]
            nI = Number.parseInt(nI)
            nP = nP.slice(0, 1)
            nP = Number.parseInt(nP)

            if (nP > 5 || nP == 5) {
                nI = nI + 1
            }
            return nI
        }

        averageUsage = round(averageUsage)

        if (averageUsage > 1) {
            type += "s"
        }

        actualUsageDisplay.innerText = `${data.actualUsage} de 12`
        mostUsedDayDisplay.innerText = `${mostUsedDay}`
        averageUsageDisplay.innerText = `${averageUsage} ${type}`


        const socket = io(apiURL, {
            extraHeaders: {
                Authorization: window.localStorage.getItem("token")
            }
        });

        socket.on("actualUsage", (data) => {
            actualUsageDisplay.innerText = `${data} de 12`
        })
    }
}