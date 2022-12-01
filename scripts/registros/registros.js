const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

if (window.localStorage.getItem("dev") == "true" || document.location.host != "127.0.0.1:5500") {
    const res = await fetch(apiURL + "/relatory/", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('token')
        }
    })

    if (res.status == 200) {
        const data = await res.json()

        const boxRegistro = document.querySelector(".box-registro")
        Object.keys(data.actions).forEach(date => {
            const actions = Object.entries(data.actions[date])
            date = date.split("/")
            const box = document.createElement("div")
            box.classList.add("box")

            const dataRegistro = document.createElement("div")
            dataRegistro.classList.add("data-registro")

            dataRegistro.innerHTML = `<h2>Data</h2>
            <h2 id="dia">${date[0]}</h2>
            <h2 id="mes">${date[1]}</h2>
            <h2 id="ano">${date[2]}</h2>`

            const linhaVertical = document.createElement("div")
            linhaVertical.id = "linha-vertical"

            const movimento = document.createElement("div")
            movimento.classList.add("movimento")
            actions.forEach(action => {
                const move = document.createElement("h2")
                const time = luxon.DateTime.fromFormat(action[0], "HH:mm:ss").setZone("America/Fortaleza").toFormat("HH:mm a")
                move.innerText = `${action[1]} - ${time}`
                movimento.appendChild(move)
            })

            box.appendChild(dataRegistro)
            box.appendChild(linhaVertical)
            box.appendChild(movimento)
            boxRegistro.appendChild(box)

        })

    }
    else if (res.status == 404) {
        const title = document.querySelector(".container-registro .title h1")
        title.innerText = "Nenhum registro encontrado"
    }
}