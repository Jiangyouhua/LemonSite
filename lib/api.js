const baseUrl = '/api/v1'

export const API = {
    login: `${baseUrl}/user/email/password`,
    userAll: `${baseUrl}/user/all`,
    userChange: `${baseUrl}/user/change`,
    goodsAll: `${baseUrl}/goods/all`,
    goodsChange: `${baseUrl}/goods/change`,
    resourcePresigned: `${baseUrl}/resources/presigned`,
};

String.prototype.request = function (method, data) {
    return new Promise((resolve, reject) => {
        fetch(this, {
            method: method,
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bear ${localStorage.getItem("token")}` },
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

String.prototype.put = function (file) {
    return new Promise((resolve, reject) => {
        fetch(this, {
            method: "PUT",
            body: file,
        }).then((response) => {
            if (response.ok) {
                resolve({ Succeed: true, Code: 0, Message: "Upload successful", Data: null })
            } else {
                reject({ Succeed: false, Code: response.status, Message: response.statusText, Data: null })
            }
        }).catch((error) => {
            reject(error)
        })
    })
}