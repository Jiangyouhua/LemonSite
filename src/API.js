import axios from 'axios';
const baseUrl = '/api/v1'

export const urlParams = new URLSearchParams(window.location.search);
export const API = {
    sendCode: `${baseUrl}/user/send/code`,
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

const getToken = () => localStorage.getItem("token") || '';

String.prototype.request = function (method, data = undefined) {
    return axios({
        method,
        url: this.toString(),
        data,
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        timeout: 15000,
    })
        .then(res => res.data)
        .catch(err => { throw err })
};

String.prototype.submit = function (target) {
    const formData = new FormData(target)
    let data = {};
    formData.forEach((value, key) => {
        let arr = key.split(".")
        if (arr.length == 1) {
            data[key] = key == "ID" ? +value : value
            return
        }
        data[arr[0]] = [...(data[arr[0]] ?? []), value]
    })
    const inputs = target.querySelectorAll("input[type='number']:enabled")

    inputs.forEach(element => {
        data[element.getAttribute("name")] = +element.value
    })
    return this.post(data)
}

String.prototype.post = function (data) {
    return this.request("POST", data)
}

String.prototype.get = function (data) {
    return (this + "?" + new URLSearchParams(data)).request("GET")
}

String.prototype.put = function (file, progress) {
    return axios.put(this, file, {
        onUploadProgress: (event) => {
            if (event.lengthComputable) {
                progress(Math.round((event.loaded / event.total) * 100))
            }
        }
    })
        .then(res => {
            return {
                Succeed: res.status === 200,
                Code: 0,
                Message: "Upload " + (res.status === 200 ? "successful" : "failed"),
                Data: res.statusText
            }
        })
        .catch(err => { throw err })
}

