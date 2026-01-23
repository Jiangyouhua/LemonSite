const baseUrl = '/api/v1'

export const API = {
    login: `${baseUrl}/user/email/password`,
    addressAll: `${baseUrl}/address/all/0`,
    addressUpdate: `${baseUrl}/address/update`,
    bankAll: `${baseUrl}/bank/all/0`,
    bankUpdate: `${baseUrl}/bank/update`,
    userAll: `${baseUrl}/user/all`,
    userUpdate: `${baseUrl}/user/update`,
    goodsAll: `${baseUrl}/goods/all`,
    goodsTags: `${baseUrl}/goods/tags`,
    goodsPromotional: `${baseUrl}/goods/promotional`,
    goodsUpdate: `${baseUrl}/goods/update`,
    orderAll: `${baseUrl}/order/all`,
    orderUpdate: `${baseUrl}/order/update`,
    kindAll: `${baseUrl}/kind/all`,
    kindUpdate: `${baseUrl}/kind/update`,
    cardAll: `${baseUrl}/card/all`,
    cardUpdate: `${baseUrl}/card/update`,
    checkAll: `${baseUrl}/check/all`,
    checkUpdate: `${baseUrl}/check/update`,
    moneyAll: `${baseUrl}/money/all`,
    moneyUpdate: `${baseUrl}/money/update`,
    messageAll: `${baseUrl}/message/all`,
    messageUpdate: `${baseUrl}/message/update`,
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
    formData.forEach((value, key) => {
        let arr = key.split(".")
        if (arr.length == 1) {
            data[key] = value
            return
        }
        data[arr[0]] = [...(data[arr[0]] ?? []), value]
    })
    const inputs = event.target.querySelectorAll("input[type='number']:enabled")

    inputs.forEach(element => {
        data[element.getAttribute("name")] = +element.value
    })

    if (Object.keys(data).join() === "ID") {
        return new Promise((resolve, reject) => {
            reject("数据为空")
        })
    }
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