import { useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Pen, Lock, Shield } from "lucide-react"
import { Resource } from "@/lib/resource"
import { FileDropzone } from "@/components/file-dropzone";
import { FileList } from "@/components/file-list";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"

/** 
 * 上传对象为 
 * { 
 * uploadURL: String, 上传URL
 * requestURL: String, 请求URL 
 * localFile: File, 准备上传的文件
 * status: Bool, 是否上传
 * }
**/
export default function FormImage({ column, name, count, value, block }) {
    const urls = !value ? [] : Array.isArray(value) ? value.map(item => { return { requestURL: item, status: true } }) : [{ requestURL: value, status: true }]
    const fileInputRef = useRef(null);
    const [disabled, setDisabled] = useState(true)
    const [selectedFiles, setSelectedFiles] = useState(urls)
    const [fileProgresses, setFileProgresses] = useState({})

    const handleFileSelect = (files) => {
        if (!files) return;
        const beLeft = count - selectedFiles.length
        let newFiles = Array.from(files);
        if (files.length + selectedFiles.length > count) {
            toast.error( `限定 ${count} 张图片，已超限定范围`)
            newFiles = newFiles.slice(0, beLeft) 
        }
        
        const array = newFiles.map(file => { return { localFile: file, status: false } })
        setSelectedFiles((prev) => [...prev, ...array]);
    };

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (filename) => {
        setSelectedFiles((prev) => prev.filter((file) => file.name !== filename));
        setFileProgresses((prev) => {
            const newProgresses = { ...prev };
            delete newProgresses[filename];
            return newProgresses;
        });
    };

    const uploadFile = (e) => {
        if (!e) {
            return
        }
        if (selectedFiles.length === 0) {
            toast.error("至少需要一张图片")
            return
        }
        e.preventDefault();
        (new Resource()).uploadImage(selectedFiles, (localFile, progress) => {
            setFileProgresses((prev) => ({
                ...prev,
                [localFile.name]: Math.min(progress, 100),
            }));
        }, (uploadFiles) => {
            setSelectedFiles(uploadFiles)
        })
    }

    return (
        <div className="grid gap-0">
            <Label >
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); setDisabled(!block ? !disabled : true) }}  >
                    {disabled ? (!block ? <Lock /> : <Shield />) : <Pen />}
                </Button>
                {name}:
            </Label>
            {selectedFiles.length == 0 && (disabled || block) ? <small className="text-center w-full p-2 border rounded-lg">暂无图片</small> : <></>}
            <div >
                {disabled || block ? <></> :
                    <FileDropzone
                        fileInputRef={fileInputRef}
                        handleBoxClick={handleBoxClick}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleFileSelect={handleFileSelect}
                    />}
                <FileList
                    selectedFiles={selectedFiles}
                    fileProgresses={fileProgresses}
                    removeFile={removeFile}
                    disabled = {disabled}
                />
                {selectedFiles.filter(file => !!file.uploadURL).map((file, index) => {
                    return (<Input key={"image_" + column + "_" + index} type='hidden' id={column} name={count > 1 ?  `${column}.${index}` : column } disabled={disabled} defaultValue={file.requestURL} />)
                })}
            </div>
            <div className="text-right  ">
                {disabled || block || selectedFiles.length == 0 ? <></> : <Button disabled={selectedFiles.filter(file => !file.status).length === 0} onClick={uploadFile}>可上传 {count} 张图片</Button>}
            </div>
        </div>
    )
}