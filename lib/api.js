const baseUrl = '/api/v1'

export const API = {
    login: `${baseUrl}/user/email/password`,
    userAll: `${baseUrl}/user/all`,
    changeUser: `${baseUrl}/user/change`,
};

String.prototype.request = function (method, data) {
    const token = localStorage.getItem("token")
    return new Promise((resolve, reject) => {
        fetch(this, {
            method: method,
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Authorization':  token},
        }).then((response) => {
            if (response.ok) {
                resolve(response.json())
            } else {
                reject(response.text())
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

String.prototype.post = function (event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    let data = {};
    formData.forEach((value, key) => (data[key] = value))
    const inputs = event.target.querySelectorAll("input[type='number']:enabled")
    inputs.forEach(element => {
        data[element.getAttribute("name")] = +element.value
    })
    return this.request("POST", data)
}

String.prototype.get = function (data) {
    return (this + "?" + new URLSearchParams(data)).request("GET")  
}