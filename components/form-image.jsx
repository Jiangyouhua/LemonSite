import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pen, Lock, Shield } from "lucide-react"
import { Resource } from "@/lib/resource"
import { FileDropzone } from "@/components/file-dropzone";
import { FileList } from "@/components/file-list";

export default function FormImage({ column, name, value, block }) {
    const multiple = Array.isArray(value)
    const [disabled, setDisabled] = useState(true)
    const [urls] = useState(multiple ? value : [value])

    return (
        <div className="grid gap-0 py-2">
            <Label >
                <Button variant="ghost" size="icon" onClick={(event) => { event.preventDefault(); setDisabled(!block ? !disabled : true) }}  >
                    {disabled ? (!block ? <Lock /> : <Shield />) : <Pen />}
                </Button>
                {name}:
            </Label>
            <div>
                <AlertDialog>
                    <AlertDialogTrigger className="w-full" disabled={disabled}>
                        <ScrollArea className="h-50 w-full rounded-md border">
                            <ImageArea urls={urls} column={column} multiple={multiple} disabled={disabled} />
                        </ScrollArea>
                    </AlertDialogTrigger>
                    <AlertContent column={column} multiple={multiple} />
                </AlertDialog>
            </div>
        </div>
    )
}


function ImageArea({ urls, column, multiple, disabled }) {
    if (urls.length === 0) {
        return <small className="text-gray-200" >{disabled ? "暂无图片" : "点击上传"}</small>
    }
    return urls.map((url, index) => {
        if (url.length === 0) {
            return <small className="text-gray-200" key={"images_" + index}>{disabled ? "暂无图片" : "点击上传"}</small>
        }
        return (
            <span key={"images_" + index}>
                <img src={url} alt="Image" className="rounded-md object-cover" />
                <Input type="hidden" disabled={disabled} name={column + (multiple ? "[]" : "")} defaultValue={url} placeholder={url} />
            </span>
        )
    })
}

function AlertContent() {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileProgresses, setFileProgresses] = useState({});
    const handleFileSelect = (files) => {
        if (!files) return;

        const newFiles = Array.from(files);
        setSelectedFiles((prev) => [...prev, ...newFiles]);
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

    const uploadFile = function () {
        (new Resource()).uploadImage(selectedFiles, ( index, progress ) =>{
            setFileProgresses((prev) => ({
                    ...prev,
                    [selectedFiles[index]]: Math.min(progress, 100),
                    }));    
        },  (filsStatus) => {
            console.log(filsStatus)
        })
    }

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>上传图片</AlertDialogTitle>
                <AlertDialogDescription className="w-full">
                    <FileDropzone
                        fileInputRef={fileInputRef}
                        handleBoxClick={handleBoxClick}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleFileSelect={handleFileSelect}
                    />
                    <FileList
                        selectedFiles={selectedFiles}
                        fileProgresses={fileProgresses}
                        removeFile={removeFile}
                    />
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={uploadFile}>确定</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}