import { Link } from 'react-router-dom';
import { Button } from "./ui/button";

export default function SiteLogo() {
    return (
        <Button variant="ghost" asChild size="lg" className="flex items-center gap-2 p-0 hover:bg-transparent focus:ring-0 h-auto">
            <Link to="/">
                <img src="/images/favicon.svg" alt="Lemon Site Logo" className="size-12"/>
                <span className="text-left">
                    <h4 className="scroll-m-20 text-xl font-bold tracking-tight text-black">柠檬短剧</h4>
                    <small className="text-sm leading-none font-light text-black/80">发现·不一样的精彩</small>
                </span>
            </Link>
        </Button>
    );
}   