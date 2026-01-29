import axios from 'axios';
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

const headers = { 'Content-Type': 'application/json', 'Authorization': `Bear ${localStorage.getItem("token")}` }

String.prototype.request = function (method, data, params) {
    return new Promise((resolve, reject) => {
        axios.request({ method: method, url: this, data: data, params: params, headers: headers })
            .then((response) => {
                if (response.status === 200) {
                    resolve(response.data)
                } else {
                    reject(response.statusText)
                }
            }).catch((error) => {
                reject(error)
            })
    })
}

String.prototype.submit = function (event) {
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
    this.post(data)
}

String.prototype.post = function (data) {
    this.request("post", data)
}

String.prototype.get = function (data) {
    this.request("get", null, data)
}

String.prototype.put = function (file, progress) {
    return new Promise((resolve, reject) => {
        axios.put(this, file, {
            onUploadProgress: (event) => {
                if (event.lengthComputable) {
                    progress(Math.round((event.loaded / event.total) * 100))
                }
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    resolve({ Succeed: true, Code: 0, Message: "Upload successful", Data: null })
                } else {
                    reject(response.statusText)
                }
            }).catch((error) => {
                reject(error)
            })
    })
}
