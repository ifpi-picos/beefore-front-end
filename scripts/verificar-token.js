const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

try {
    const res = await fetch(apiURL + "/auth/token", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": window.localStorage.getItem("token")
        }
    })

    if (res.status != 200) {
        window.localStorage.removeItem("token")
        document.location.href = "/"
    }
    else if (res.status == 200) {
        const data = await res.json()
        window.localStorage.setItem("token", data.token)

        const coordinatorOnly = document.getElementById("coordinator-only")

        if(coordinatorOnly && data.user.type != "Coordinator"){
            document.location.href = "/"
        }
    }
}
catch (err) {
    window.localStorage.removeItem("token")
    document.location.href = "/"
}

