const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.kamiapp.com.br"

function setCookie(name, value, maxAge) {
    let expires = "";
    if (maxAge) {
        let date = new Date();
        date.setTime(date.getTime() + maxAge);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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
        setCookie("redirect", document.location.href, 1000 * 60 * 10)
        document.location.href = "/"
    }
    else if (res.status == 200) {
        const data = await res.json()
        window.localStorage.setItem("token", data.token)

        const coordinatorOnly = document.getElementById("coordinator-only")

        if (coordinatorOnly && data.user.type != "Coordinator") {
            document.location.href = "/dashboard.html"
        }
    }
}
catch (err) {
    window.localStorage.removeItem("token")
    document.location.href = "/"
}

