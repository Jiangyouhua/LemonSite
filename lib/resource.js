import { API } from '../src/API'

export function Resource() {
    this.willUploads = []
    this.didUploads = {}
}

Resource.prototype.uploadImage = function (files, progress, back) {
    const suffixes = files.map((file) => file.name.split(".").pop())
    this.presigned("image", suffixes, files, progress, back) 
}

Resource.prototype.presigned = function (bucket, suffixes, files, progress, back) {
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
            this.willUploads = uploads
            this.didUploads = {}
            for (let i in uploads){
                this.didUploads[uploads[i].file] = {index: i, status: false}
            }
            this.upload(progress, back)
        } else {
            back([], [], result.message)
        }
    })
}

Resource.prototype.upload = function (progress, back) {
    if (this.uploads.length === 0) {
        back(this.didUploads)
        return
    }
    let item = this.uploads.shift()
    if (!item.file) {
        this.upload(back)
        return
    }
    item.uploadURL.put(item.file, (p) => {
        let it = this.didUploads[item.file]
        progress(it.index, it.status, p)
    }).then((result) => {
        progress(this.didUploads[item.file].index, true, 0)
        this.didUploads[item.file].status = result.Succeed
        this.upload(back)
    })
}