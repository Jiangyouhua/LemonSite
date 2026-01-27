const baseUrl = '/api/v1'

export const urlParams = new URLSearchParams(window.location.search);
export const API = {
    login: `${baseUrl}/user/email/password`,
    addressAll: `${baseUrl}/address/all`,
    addressUser: `${baseUrl}/address/user/${urlParams.get("user_id")}`,
    addressUpdate: `${baseUrl}/address/update`,
    bankAll: `${baseUrl}/bank/all`,
    bankUser: `${baseUrl}/bank/user/${urlParams.get("user_id")}`,
    bankUpdate: `${baseUrl}/bank/update`,
    cardAll: `${baseUrl}/card/all`,
    cardUpdate: `${baseUrl}/card/update`,
    categoryAll: `${baseUrl}/category/all`,
    categoryUpdate: `${baseUrl}/category/update`,
    chapterAll: `${baseUrl}/chapter/all`,
    chapterDrama: `${baseUrl}/chapter/drama/${urlParams.get("drama_id")}`,
    chapterUpdate: `${baseUrl}/chapter/update`,
    commentAll: `${baseUrl}/comment/all`,
    commentUpdate: `${baseUrl}/comment/update`,
    dramaAll: `${baseUrl}/drama/all`,
    dramaUpdate: `${baseUrl}/drama/update`,
    dramaTags: `${baseUrl}/drama/tags/all`,
    checkAll: `${baseUrl}/check/all`,
    checkUpdate: `${baseUrl}/check/update`,
    feedbackAll: `${baseUrl}/feedback/all`,
    feedbackUpdate: `${baseUrl}/feedback/update`,
    goodsAll: `${baseUrl}/goods/all`,
    goodsTags: `${baseUrl}/goods/tags/all`,
    goodsPromotional: `${baseUrl}/goods/promotional/all`,
    goodsUpdate: `${baseUrl}/goods/update`,
    messageToSystem: `${baseUrl}/message/all`,
    messageToUser: `${baseUrl}/user/0/group/0`,
    messageUpdate: `${baseUrl}/message/update`,
    moneyTopUp: `${baseUrl}/money/topup/all`,
    moneyWithdrawal: `${baseUrl}/money/withdrawal/all`,
    moneyUpdate: `${baseUrl}/money/update`,
    orderAll: `${baseUrl}/order/all`,
    orderUpdate: `${baseUrl}/order/update`,
    resourcePresigned: `${baseUrl}/resources/presigned`,
    userAll: `${baseUrl}/user/all`,
    userUpdate: `${baseUrl}/user/update`,
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