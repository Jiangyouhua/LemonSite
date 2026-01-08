
import { ChevronRight } from "lucide-react"
import { useLocation } from "react-router-dom"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  UsersRound,
  ShoppingCart,
  LandPlot,
  Images,
  ListOrdered,
  MessageCircle
} from "lucide-react"
import { useState } from "react"

const items = [
    {
        title: "用户管理",
        url: "#",
        icon: UsersRound,
        items: [
            {
                title: "用户明细",
                url: "/admin/users",
            },
            {
                title: "用户权限",
                url: "/admin/roles",
            },
        ],
    },
    {
        title: "商品管理",
        url: "#",
        icon: ShoppingCart,
        items: [
            {
                title: "商品明细",
                url: "/goods/detail",
            },
        ],
    },
    {
        title: "活动管理",
        url: "#",
        icon: LandPlot,
        items: [
            {
                title: "活动类型",
                url: "/activity/kind",
            },
            {
                title: "活动明细",
                url: "/activity/detail",
            },
        ],
    },
    {
        title: "资源管理",
        url: "#",
        icon: Images,
        items: [
            {
                title: "图片资源",
                url: "/resource/image",
            },
            {
                title: "音频资源",
                url: "/resource/audio",
            },
            {
                title: "视频资源",
                url: "/resource/video",
            },
            {
                title: "文件资源",
                url: "/resource/file",
            },
        ],
    },
    {
        title: "订单管理",
        url: "#",
        icon: ListOrdered,
        items: [
            {
                title: "积分管理",
                url: "/order/score",
            },
            {
                title: "充值管理",
                url: "/order/recharge",
            },
            {
                title: "提现管理",
                url: "/order/withdrawal",
            },
        ],
    },
    {
        title: "信息管理",
        url: "#",
        icon: MessageCircle,
        items: [
            {
                title: "系统信息",
                url: "/message/system",
            },
            {
                title: "反馈信息",
                url: "/message/faceback",
            },
            {
                title: "用户信息",
                url: "/message/user",
            },
        ],
    },
]

export function AdminMenu() {
    const location = useLocation();
    const pathname = useState(location.pathname ?? "/user")

    return (
        <SidebarGroup>
            <SidebarGroupLabel>管理</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.items.filter((it) => it.url === pathname).length > 0}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <a href={subItem.url}>
                                                    <span>{subItem.title}</span>
                                                </a>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
