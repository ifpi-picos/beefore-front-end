const apiURL = document.location.host != "beefore.netlify.app" ? "http://localhost:3001" : "https://beefore.onrender.com"

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

fetch(apiURL + "/auth/token", {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        token: getCookie("token")
    })
})
    .finally(res => {
        if (res.status != 100) {
            document.location.href = "/"
            document.cookie = "token=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        }
    })