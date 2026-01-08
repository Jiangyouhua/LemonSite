import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import SiteLogo from "./site-logo"

export function HomeHeader() {
    return (
        <header className="flex w-full h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) backdrop-blur-sm bg-white/20 ">
            <div className="flex w-full items-center gap-2 px-8 lg:gap-4 lg:px-16 py-4">
                <h1 className="flex items-center gap-2">
                <SiteLogo />
                </h1>
                <div  className="ml-4 text-sm font-light gap-4 text-white/80"> &nbsp;  </div>
                <div className="ml-auto flex items-center gap-2 ">
                    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                        <Link to="agreement.html" target="_blank" rel="noopener noreferrer" className="text-black"> 用户协议 </Link>
                    </Button>
                    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                        <Link to="policy.html" target="_blank" rel="noopener noreferrer" className="text-black"> 隐私政策 </Link>
                    </Button>
                    <Button asChild size="sm" className="hidden sm:flex ml-4">
                        <Link to="login" rel="noopener noreferrer" className="dark:text-foreground"> 登录 </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
