import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function CellAvatar({ url }) {
    return (
        <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center self-start row-span-2 overflow-hidden">
            {
                !url || url.length == 0 ?
                    <small>IM</small> :
                    <img
                        src={url}
                        alt={url}
                        className="w-full h-full object-cover"
                    />
            }
        </div>
    )
}