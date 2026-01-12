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
import { Pen, Lock } from "lucide-react"
import { useState } from "react"
import { Resource } from "@/lib/resource"
import { toast } from "sonner"

export default function FormImage({ column, holder, value }) {
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

    return (
        <div className='flex' >
            <div className="grow"></div>
            <div className="relative size-20 text-left">
                <Button className="absolute z-10 rounded-full" variant="default" size="icon" onClick={(event) => { event.preventDefault(); setDisabled(!disabled) }}  >
                    {disabled ? <Lock /> : <Pen />}
                </Button>
                <div>
                    <AlertDialog>
                        <AlertDialogTrigger disabled={disabled}>
                            <Avatar className="absolute size-30 z-0 offset">
                                <AvatarImage src={url} alt={column} />
                                <AvatarFallback>{holder.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                        </AlertDialogTrigger>
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
                    </AlertDialog>
                    <Input type="hidden" disabled={disabled} name={column} defaultValue={url} placeholder={url} />
                </div>
            </div>
            <div className="grow"></div>
        </div>
    )
}
