import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function CellAvatar({ url }) {
    return (
        <Avatar className="h-12 w-12 rounded-lg mr-2">
            <AvatarImage src={url} alt={url} />
            <AvatarFallback className="rounded-lg">IM</AvatarFallback>
        </Avatar>
    )
}