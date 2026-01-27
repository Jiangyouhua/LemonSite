import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pen, Lock, Shield } from "lucide-react"
import { useState } from "react"
import { Resource } from "@/lib/resource"
import { toast } from "sonner"

export default function FormAvatar({ column, name, value, isImage, block }) {
    const [disabled, setDisabled] = useState(true)
    const [url, setUrl] = useState(value)

    const uploadFile = function () {
        let files = Array.prototype.slice.call(document.getElementById(column).files);
        let resource = new Resource()
        resource.uploadImage(files, function (winners, losers, message) {
            if (winners.length === 0) {
                toast.error(message)
                return
            }
            toast.success("图片上传成功")
            setUrl(winners[0].requestURL)
        })
    }

    if (isImage) {
        return (
            <div className="grid gap-0 py-2">
                <Label >
                    <Button variant="ghost" size="icon" onClick={(event) => { event.preventDefault(); setDisabled(!block ? !disabled : true) }}  >
                        {disabled ? ( !block ? <Lock /> : <Shield />) : <Pen />}
                    </Button>
                    {name}:
                </Label>
                <div>
                    <AlertDialog>
                        <AlertDialogTrigger className="w-full" disabled={disabled}>
                             <ScrollArea className="h-50 w-full rounded-md border">
                                {!url ? <span>暂无图片</span> : <img src={url} alt="Image" className="rounded-md object-cover" />}
                            </ScrollArea>
                        </AlertDialogTrigger>
                        <AlertContent column={column} uploadFile={uploadFile} />
                    </AlertDialog>
                    <Input type="hidden" disabled={disabled} name={column} defaultValue={url} placeholder={url} />
                </div>
            </div>
        )
    }

    return (
        <div className='flex' >
            <div className="grow"></div>
            <div className="relative size-30 text-left">
                <Button className="absolute z-10 rounded-full" variant="default" size="icon" onClick={(event) => { event.preventDefault(); setDisabled(!disabled) }}  >
                    {disabled ? <Lock /> : <Pen />}
                </Button>
                <div>
                    <AlertDialog>
                        <AlertDialogTrigger className="" disabled={disabled}>
                            <Avatar className="size-30 z-0">
                                <AvatarImage src={url} alt={column} />
                                <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                        </AlertDialogTrigger>
                        <AlertContent column={column} uploadFile={uploadFile} />
                    </AlertDialog>
                    <Input type="hidden" disabled={disabled} name={column} defaultValue={url} placeholder={url} />
                </div>
            </div>
            <div className="grow"></div>
        </div>
    )
}

export function AlertContent({ column, uploadFile }) {
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>上传图片</AlertDialogTitle>
                <AlertDialogDescription>
                    <Input id={column} type="file" accept="image/png, image/jpeg" />
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={uploadFile}>确定</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
