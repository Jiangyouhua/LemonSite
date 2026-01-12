
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocalStorage } from "@uidotdev/usehooks"

export default function AdminUser() {
    const [user, setUser] = useLocalStorage("user")
    const [_, setAuth] = useLocalStorage("auth")
    const logoutHandel = function () {
        setUser(null)
        setAuth(false)
        localStorage.setItem("token", "")
        window.location = '/login'
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.AvatarURL} alt={user.Name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 w-16 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.Name ?? user.Phone}</span>
                                <span className="truncate text-xs">{user.Email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={"bottom"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                用户账号
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                用户信息
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logoutHandel}>
                            <LogOut />
                            退出
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
