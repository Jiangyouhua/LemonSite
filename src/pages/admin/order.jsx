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
import CellImage from "@/components/cell-image"

const processTags = ["全部", "待支付", "待发货", "待收货", "已收货"].map((item, index) => { return { Value: index, Name: item } })
const statusTags = ["无", "正常", "退货", "已退货", "取消"].map((item, index) => { return { Value: index, Name: item } })
const kindTags = ['未设置', "兑换", "购买"].map((item, index) => { return { Value: index, Name: item } })

const tableKeys = {
    User: Seer("", "用户", true, (v) => v.Name),
    Goods: Seer("", "商品", true, (v) => <CellImage url={!v.ImageURL || v.ImageURL.length < 1 ? "" : v.ImageURL[0]} />),
    Address: Seer("", "地址", true, (v) => v.Detail),
    CourierCompany: Seer("", "快递公司", true),
    CourierNumber: Seer("", "快递单号", true),
    Kind: Seer(0, "支付方式", true),
    Quantity: Seer(0, "数量", true),
    Amount: Seer(0, "总额", true),
    Decount: Seer(0, "折扣", true),
    DecountDescription: Seer("", "折扣说明", true),
    Process: Seer("", "状态", true, (v) => processTags[v].Name),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function OrderPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "商品管理", url: "/admin" },
            { name: "订单明细", url: "/admin/order" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.orderAll.get({limit, offset, key, value}).then((result) => {
            setLoaded(true)
            if (result.Succeed) {
                back(result.Data)
            } else {
                toast.error("数据加载失败，请稍后再试")
            }
        }).catch((error) => {
            toast.error(error)
        })
    }

    const finishSave = () => {
         toast.success("成功保存更新的内容")
        setLoaded(false)
    }

    const editDetail = (_order) => {
        setOrder(_order)
        setOpen(true)
    }

    return (
        <div className="mx-4 w-auto">
            <AdminTable
                loaded={loaded}
                dict={tableKeys}
                loadData={loadData}
                actions={[{ name: "编辑内容", func: editDetail }]}
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{!order || !order.ID ? "新添内容" : "编辑内容，ID：" + order.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm data={order} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProfileForm({ data, saved }) {
    const [item, setItem] = useState(data)
    const orderUpdate = (event) => {
        API.orderUpdate.submit(event).then((result) => {
            if (result.Succeed) {
                saved()
                setItem(result.Data)
            } else {
                toast.error("数据更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <form onSubmit={orderUpdate} className="grid items-start gap-6"  >
            <ScrollArea className="h-140 m-[-12px] p-[12px]">
                <div >
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormInput name={tableKeys.User.name} column="User" value={item.User.Name} type="text" block={true} />
                    <FormInput name={tableKeys.Goods.name} column="Goods" value={item.Goods.Name} type="text" block={true} />
                    <FormInput name={tableKeys.Address.name} column="Address" value={`${item.Address.Name} ${item.Address.Phone}：${item.Address.Province}${item.Address.City}${item.Address.District}${item.Address.Detail}`} type="text" block={true} />
                    <FormInput name={tableKeys.CourierCompany.name} column="CourierCompany" value={item.CourierCompany} type="text" />
                    <FormInput name={tableKeys.CourierNumber.name} column="CourierNumber" value={item.CourierNumber} type="text" />
                    <FormSelect name={tableKeys.Kind.name} column="Kind" value={item.Kind} options={kindTags} block={true} />
                    <FormInput name={tableKeys.Quantity.name} column="Quantity" value={item.Quantity} type="number" block={true} />
                    <FormInput name={tableKeys.Amount.name} column="Amount" value={item.Amount} type="number" block={true} />
                    <FormInput name={tableKeys.Decount.name} column="Decount" value={item.Decount} type="number" block={true} />
                    <FormInput name={tableKeys.DecountDescription.name} column="DecountDescription" value={item.DecountDescription} block={true} />
                    <FormSelect name={tableKeys.Process.name} column="Process" value={item.Process} options={processTags} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" >保存更新</Button>
        </form>
    )
}
