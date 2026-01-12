import {
  UsersRound,
  ShoppingCart,
  LandPlot,
  Images,
  ListOrdered,
  MessageCircle,
  FileQuestion,
  Settings,
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
