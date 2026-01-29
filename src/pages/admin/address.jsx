import { useState, useEffect } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"
import { toast } from "sonner"
import { API, urlParams } from "@/src/API"
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

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    ID: Seer(0, "ID", true),
    Name: Seer("", "收件人", true),
    Phone: Seer("", "联系电话", true),
    Province: Seer("", "省（自冶区）", true),
    City: Seer("", "市", true),
    District: Seer("", "区", true),
    Detail: Seer("", "详细地址", true),
    Code: Seer(0, "邮政号码", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function AddressPage() {
    const [open, setOpen] = useState(false)
    const [address, setAddress] = useState()
    const [data, setData] = useState({ Total: 0, Items: [] })
    const [pagination, setPagination] = useState({ offset: 0, limit: 0, key: "", value: "" })
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "用户管理", url: "/admin" },
            { name: "用户明细", url: "/admin/user" },
            { name: `${urlParams.get("user_name")}的收货地址`, url: location },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.addressUser.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
            if (result.Succeed) {
                setPagination({ offset: offset, limit: limit, key: key, value: value })
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

    const editDetail = (_address) => {
        setAddress(_address)
        setOpen(true)
    }

    const addItem = () => {
        let _address = { UserID: urlParams.get("user_id") }
        Object.entries(tableKeys).forEach(([k, v]) => {
            _address[k] = v.value
        })
        setAddress(_address)
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
                        actions={[{ name: "编辑内容", func: editDetail }]}
                        addItem={addItem}
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{ !address || address.ID === 0 ? "新添内容" : "编辑内容，ID：" + address.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={address} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved, edit }) {
    const addressUpdate = function (event) {
        API.addressUpdate.submit(event).then((result) => {
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
        <form className="grid items-start gap-6" onSubmit={addressUpdate} aria-disabled={!edit}>
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <input type="hidden" name="ID" value={item.id} />
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Phone.name} column="Phone" value={item.Phone} />
                    <FormInput name={tableKeys.Province.name} column="Province" value={item.Province} />
                    <FormInput name={tableKeys.City.name} column="City" value={item.City} />
                    <FormInput name={tableKeys.District.name} column="District" value={item.District} />
                    <FormInput name={tableKeys.Detail.name} column="Detail" value={item.Detail} />
                    <FormInput name={tableKeys.Code.name} column="Code" value={item.Code} type="number" />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
