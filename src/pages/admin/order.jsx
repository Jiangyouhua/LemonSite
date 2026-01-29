import { useState, useEffect } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"
import { toast } from "sonner"
import { API } from "@/src/API"
import { Seer } from "@/lib/seer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import AdminTable from "@/components/admin-table"
import FormInput from "@/components/form-input"
import FormSelect from "@/components/form-select"

const statusTags = ['未设置', "待付款", "待发货", "待收货", "取消", "退款"].map((item, index) => { return { ID: index, Name: item } })
const kindTags = ['未设置', "兑换", "购买"].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    ID: Seer(0, "ID", true),
    UserID: Seer(0, "用户ID"),
    GoodsID: Seer(0, "商品ID"),
    Kind: Seer(0, "支付方式", true),
    Quantity: Seer(0, "数量", true),
    Amount: Seer(0, "总额", true),
    Decount: Seer(0, "折扣", true),
    DecountDescription: Seer("", "折扣说明", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function OrderPage() {
    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState()
    const [data, setData] = useState({ Total: 0, Items: [] })
    const [pagination, setPagination] = useState({offset:0, limit: 0, key: "", value:""})
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "商品管理", url: "/admin" },
            { name: "订单明细", url: "/admin/order" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.orderAll.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
            if (result.Succeed) {
                setPagination({offset:offset, limit: limit, key: key, value:value})
                setData(result.Data)
                back(result.Data.Total)
            } else {
                toast.error("数据加载失败，请稍后再试")
            }
        }).catch((error) => {
            toast.error(error)
        })
    }

    const finishSave = function () {
        loadData(pagination.offset, pagination.limit, pagination.key, pagination.value, function () {
            setOpen(false)
        })
    }

    const editDetail = (_order) => {
        setOrder(_order)
        setOpen(true)
    }

    return (
        <div className="mx-4 w-auto">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <AdminTable
                        total={data.Total}
                        items={data.Items}
                        dict={tableKeys}
                        loadData={loadData}
                        actions={[{name: "编辑内容", func: editDetail}]}
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{ !order || order.ID === 0 ? "新添内容" : "编辑内容，ID：" + order.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={order} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const orderUpdate = function (event) {
        API.orderUpdate.submit(event).then((result) => {
            if (result.Succeed) {
                saved()
            } else {
                toast.error("数据更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <form className="grid items-start gap-6" onSubmit={orderUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <input type="hidden" name="ID" value={item.id} />
                    <FormSelect name={tableKeys.Kind.name} column="Kind" value={item.Kind} options={kindTags} block={true}/>
                    <FormInput name={tableKeys.Quantity.name} column="Quantity" value={item.Quantity} type="number" block={true} />
                    <FormInput name={tableKeys.Amount.name} column="Amount" value={item.Amount} type="number" block={true}/>
                    <FormInput name={tableKeys.Decount.name} column="Decount" value={item.Decount} type="number" block={true}/>
                    <FormInput name={tableKeys.DecountDescription.name} column="DecountDescription" value={item.DecountDescription} block={true} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
