const buttonMenu = document.getElementById("button-menu")

const navList = document.querySelector(".nav-list")

if (window.screen.width <= 750) {
    navList.setAttribute("active", "false")
    navList.style = "display: none;"
}
else {
    navList.setAttribute("active", "true")
    navList.style = "display: flex;"
}

buttonMenu.addEventListener("click", () => {
    if (navList.getAttribute("active") == "false") {
        navList.style = "display: flex;"
        navList.setAttribute("active", "true")
    }
    else {
        navList.style = "display: none;"
        navList.setAttribute("active", "false")
    }
})