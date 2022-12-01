const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

if (window.localStorage.getItem("dev") == "true" || document.location.host != "127.0.0.1:5500") {
    try {
        const res = await fetch(apiURL + "/auth/token", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('token')
            }
        })

        if (res.status != 200) {
            window.localStorage.removeItem("token")
            document.location.href = "/"
        }
        else if (res.status == 200) {
            const data = await res.json()
            window.localStorage.setItem("token", data.token)
        }
    }
    catch (err) {
        window.localStorage.removeItem("token")
        document.location.href = "/"
    }
}
else {
    document.querySelector("main").style.display = "flex"
}