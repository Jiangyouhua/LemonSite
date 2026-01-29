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

export default function FormAvatar({ column, name, value }) {
    const [disabled, setDisabled] = useState(true)
    const [url, setUrl] = useState(value)

     const uploadFile = function() {
       (new Resource()).inputImage(column, (winners, ) => {
            setUrl(winners[0].requestURL)
       }) 
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
                <AlertDialogDescription className="w-full">
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