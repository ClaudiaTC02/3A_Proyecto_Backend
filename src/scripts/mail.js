
function enviarMail(){
    fetch(PUERTO_IP + "/enviarMail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .catch((err) => console.log('Fetch failed ' + err))
        .then((res) => res.json())
        .then(data => {
          cb(data)
        })
       
}
