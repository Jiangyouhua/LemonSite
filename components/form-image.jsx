import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function FormImage({ name, holder, value }) {
    return (
        <div className='flex' >
            <div className="grow"></div>
            <Avatar className="size-20">
                <AvatarImage src={value} alt={name} />
                <AvatarFallback>{holder.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="grow"></div>
        </div>
    )
}
