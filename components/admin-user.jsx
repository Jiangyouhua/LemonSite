
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

const user = {
    ID: 1,
    CreatedAt: "2025-12-30T12:41:59.482659Z",
    UpdatedAt: "2025-12-30T22:27:24.642199Z",
    DeletedAt: "0001-01-01T00:00:00Z",
    Name: "姜友华",
    Phone: "18012345678",
    Email: "a@b.com",
    LoginPassword: "acd7777d1187cb0edb30ead6ca9b61e248d462039e2ee2587b37569acc331c32",
    TransactionPassword: "",
    RealName: "",
    CardID: "",
    AvatarURL: "http://192.168.1.253:9000/image/222b4a60-5428-403d-8edd-2b874921d1bc.jpeg",
    Score: 0,
    Money: 0,
    Cash: 0,
    AddressID: 0,
    BankID: 0,
    Alipay: "",
    Weichat: "",
    Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzk5MjAxOTYxLCJpYXQiOjE3Njc2NjU5NjF9.Sr0q9aDABvsnPJe3szSiuvDs6IjHY1biXID1D7ST7Sg",
    Status: 1
}

export default function AdminUser() {
    const logoutHandel = function () {
        localStorage.setItem("user", "")
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
                                <span className="truncate font-medium">{user.Name}</span>
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
