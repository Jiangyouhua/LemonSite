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
import FormText from "@/components/form-text"
import FormInput from "@/components/form-input"
import FormSelect from "@/components/form-select"
import FormAvatar from "@/components/Form-avatar"
import CellAvatar from "@/components/cell-avatar"

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => {return {ID:index, Name: item}})
const tableKeys = {
    ID: Seer(0, "ID", true),
    Name: Seer("", "名称", true),
    Description:Seer("", "说明", true),
    ImageURL: Seer("", "页面图", true, (v) => <CellAvatar url={v} />),
    IconURL: Seer("", "类型ICON", true, (v) => <CellAvatar url={v} />),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function CategoryPage() {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState()
    const [data, setData] = useState({ Total: 0, Items: [] })
    const [pagination, setPagination] = useState({offset:0, limit: 0, key: "", value:""})
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "打卡管理", url: "/admin" },
            { name: "打卡类型", url: "/admin/category" },
        ])
    }, [setNavs]) 

    const loadData = (offset, limit, key, value, back) => {
        API.categoryAll.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
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

    const editDetail = (_category) => {
        setCategory(_category)
        setOpen(true)
    }

    const addItem = () => {
        let _category    = {}
        Object.entries(tableKeys).forEach(([k, v]) => {
            _category[k] = v.value
        })
        setCategory(_category)
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
                        addItem={addItem}
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>编辑内容</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={category} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const categoryUpdate = function (event) {
        API.categoryUpdate.post(event).then((result) => {
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
        <form className="grid items-start gap-6" onSubmit={categoryUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <div className="text-center">
                        <FormAvatar name={item.Name} column="IconURL" value={item.IconURL} />
                        <FormText name="ID" column="ID" value={item.ID} />
                    </div>
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Description.name} column="Description" value={item.Description} />
                    <FormAvatar name={tableKeys.ImageURL.name} column="ImageURL" value={item.ImageURL} isImage={true} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
