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

export const AdminMenus = [
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
                title: "收货地址",
                url: "/admin/address",
            },
            {
                title: "银行帐号",
                url: "/admin/bank",
            },
            {
                title: "意见反馈",
                url: "/message/faceback",
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
                url: "/admin/goods",
            },
            {
                title: "订单明细",
                url: "/admin/order",
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
                url: "/admin/kind",
            },
            {
                title: "活动明细",
                url: "/admin/card",
            },
            {
                title: "用户活动",
                url: "/admin/check",
            },
        ],
    },
    {
        title: "短剧管理",
        url: "#",
        icon: Clapperboard,
        items: [
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
        items: [
            {
                title: "提现",
                url: "/admin/money?kind=2",
            },
            {
                title: "充值",
                url: "/admin/money?kind=1",
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
                title: "推送信息",
                url: "/message/push",
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
