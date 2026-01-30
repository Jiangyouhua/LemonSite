import { API } from '../src/API'

export function Resource() {
    this.uploads = []
}

/*
* files = [{
* { 
 * uploadURL: String, 上传URL
 * requestURL: String, 请求URL 
 * localFile: File, 准备上传的文件
 * status: Bool, 是否上传
 * }
* }]
*/
Resource.prototype.uploadImage = function (files, progress, back) {
    const suffixes = files.map((file) => file.localFile.name.split(".").pop())
    this.presigned("image", suffixes, files, progress, back) 
}

Resource.prototype.presigned = function (bucket, suffixes, files, progress, back) {
    API.resourcePresigned.request("POST", { bucket: bucket, suffixes: suffixes }).then((result) => {
        if (result.Succeed) {
            if (!result.Data || result.Data.length != files.length) {
                back([], [], "上传失败")
                return
            }
            this.uploads = result.Data.map((element, index) => {
                element.localFile = files[index].localFile
                element.status = false
                return element
            });
            this.upload(progress, 0, back)
        } else {
            back([], [], result.message)
        }
    })
}

Resource.prototype.upload = function (progress, index, back) {
    if (index >= this.uploads.length) {
        back(this.uploads)
        return
    }

    let item = this.uploads[index]
    if (item.status){
        this.upload(progress, index + 1, back)
        return 
    }

    item.uploadURL.put(item.localFile, (p) => {
        progress(item.localFile, p)
    }).then((result) => {
        this.uploads[index].status = result.Succeed
        back(this.uploads)
        this.upload(progress, index + 1, back)
    })
}