const fields = document.querySelectorAll("#form-codigo input")

fields.forEach((field, index) => {
    field.addEventListener("keydown", (event) => {
        event.preventDefault()
        if (event.key.match(/[0-9]/)) {
            if (field.value.length < 1) {
                field.value += event.key
            }
            else {
                field.value = event.key
            }
            
            if (fields.length > index + 1) {
                fields[index + 1].focus()
            }
            else{
                fields[0].focus()
            }
        }
        else if(event.key == "Tab"){
            if (fields.length > index + 1) {
                fields[index + 1].focus()
            }
            else{
                fields[0].focus()
            }
        }
    })
})
