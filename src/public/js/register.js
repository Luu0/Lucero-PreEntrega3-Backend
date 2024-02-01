const registerForm  = document.getElementById("registro");

registerForm .addEventListener('submit', e =>{
    
    e.preventDefault()
    const data = new FormData(registerForm)
    console.log(data)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch('/api/sessions/register', {
        method:"POST",
        body: JSON.stringify(obj),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then( result =>{
        if(result.status === 200){
            window.location.replace('/users/login')
        }
    })
})

