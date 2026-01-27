import { API } from '../src/API'

export function Resource() {
    this.uploads = []
    this.winners = []
    this.losers = []
}

Resource.prototype.uploadImage = function (files, back) {
    const suffixes = files.map((file) => file.name.split(".").pop())
    this.presigned("image", suffixes, files, back) 
}

Resource.prototype.presigned = function (bucket, suffixes, files, back) {
    API.resourcePresigned.request("POST", { bucket: bucket, suffixes: suffixes }).then((result) => {
        if (result.Succeed) {
            const uploads = result.Data
            if (!uploads || uploads.length != files.length) {
                back([], [], "上传失败")
                return
            }
            files.forEach((element, index) => {
                uploads[index].file = element
            });
            this.uploads = uploads
            this.upload(back)
        } else {
            back([], [], result.message)
        }
    })
}

Resource.prototype.upload = function (back) {
    if (this.uploads.length === 0) {
        back(this.winners, this.losers, "上传成功")
        return
    }
    let item = this.uploads.shift()
    if (!item.file) {
        this.losers.push(item)
        this.upload(back)
        return
    }
    item.uploadURL.put(item.file).then((result) => {
        if (result.Succeed) {
            this.winners.push(item)
        } else {
            this.losers.push(item)
        }
        this.upload(back)
    })
}