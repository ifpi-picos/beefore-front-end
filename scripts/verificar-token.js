const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

if (document.location.host != "127.0.0.1:5500") {
    fetch(apiURL + "/auth/token", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('token')
        }
    })
        .then(res => {
            if (res.status != 200) {
                document.location.href = "/"
            }
        })
        .catch(err => {
            document.location.href = "/"
        })
}