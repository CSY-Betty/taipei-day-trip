fetch(`/api/attractions`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
})
.then(respose => respose.json())
.catch(error => {
    
})