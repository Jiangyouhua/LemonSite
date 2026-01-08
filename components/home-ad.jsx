import { Separator } from "@/components/ui/separator"

export default function HomeAd() {
    return (
        <div className="w-full h-full">
            <p className="text-[16rem] font-light text-black">100,000</p>
            <p className="text-4xl font-bold text-black">部，优秀短剧，让您</p>
            <p className="text-xl font-light text-black my-8">发现·不一样的精彩</p>
            <Separator className="my-4 border-white/30 w-1/2" />
        </div>
    )
}