import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function CellAvatar({ url }) {
    return (
    <Avatar className="size-10">
        <AvatarImage src={url} />
        <AvatarFallback>IMG</AvatarFallback>
    </Avatar>
    )
}