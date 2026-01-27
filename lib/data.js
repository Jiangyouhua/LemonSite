import {
    UsersRound,
    ShoppingCart,
    LandPlot,
    CircleDollarSign,
    MessageCircle,
    FileQuestion,
    Settings,
    Clapperboard,
} from "lucide-react"
import { Children } from "react"

export const StatusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { ID: index, Name: item } })

export const AdminMenus = [
    {
        title: "用户管理",
        url: "#",
        icon: UsersRound,
        children: [
            {
                title: "用户明细",
                url: "/admin/user",
            },
            {
                title: "意见反馈",
                url: "/admin/feedback",
            },
        ],
    },
    {
        title: "商品管理",
        url: "#",
        icon: ShoppingCart,
        children: [
            {
                title: "商品明细",
                url: "/admin/goods",
            },
            {
                title: "订单明细",
                url: "/admin/order",
            },
        ],
    },
    {
        title: "打卡管理",
        url: "#",
        icon: LandPlot,
        children: [
            {
                title: "打卡类型",
                url: "/admin/category",
            },
            {
                title: "打卡项目",
                url: "/admin/card",
            },
            {
                title: "用户打卡",
                url: "/admin/check",
            },
        ],
    },
    {
        title: "短剧管理",
        url: "#",
        icon: Clapperboard,
        children: [
            {
                title: "短剧明细",
                url: "/admin/drama",
            },
            {
                title: "短剧评论",
                url: "/admin/comment",
            },
        ],
    },
    {
        title: "现金管理",
        url: "#",
        icon: CircleDollarSign,
        children: [
            {
                title: "充值记录",
                url: "/admin/top_up",
            },
            {
                title: "提现记录",
                url: "/admin/withdrawal",
            },
        ],
    },
    {
        title: "信息管理",
        url: "#",
        icon: MessageCircle,
        children: [
            {
                title: "系统信息",
                url: "/admin/message_system",
            },
            {
                title: "用户信息",
                url: "/admin/message_user",
            },
        ],
    },
]


export const AdminOptions = [
    {
        name: "设置",
        url: "/setting",
        icon: Settings,
    },
    {
        name: "帮助",
        url: "/help",
        icon: FileQuestion,
    }
]