import { useState } from "react"
import { toast } from "sonner"
import { API } from "@/lib/api"
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
import CellAvatar from "@/components/cell-avatar"

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => {return {ID:index, Name: item}})
const tableKeys = {
    ID: Seer(0, "ID", true),
    IconURL: Seer("", "类型ICON", true, (v) => <CellAvatar url={v} />),
    Name: Seer("", "名称", true),
    Description:Seer("", "说明", true),
    ImageURL: Seer("", "页面图", true, (v) => <CellAvatar url={v} />),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function KindPage() {
    const [open, setOpen] = useState(false)
    const [kind, setKind] = useState()
    const [data, setData] = useState({ total: 0, items: [] })
    const [pagination, setPagination] = useState({offset:0, limit: 0, key: "", value:""})

    const loadData = (offset, limit, key, value, back) => {
        API.kindAll.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
            if (result.Succeed) {
                setPagination({offset:offset, limit: limit, key: key, value:value})
                setData(result.Data)
                back(result.Data.total)
            } else {
                toast.error("邮箱或密码错误")
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

    const showDetail = (_kind) => {
        setKind(_kind)
        setOpen(true)
    }

    return (
        <div className="mx-4 w-auto">
            <Dialog open={open} onOpenUpdate={setOpen}>
                <DialogTrigger asChild>
                    <AdminTable
                        total={data.total}
                        items={data.items}
                        dict={tableKeys}
                        loadData={loadData}
                        showDetail={showDetail}
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>用户信息</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={kind} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const kindUpdate = function (event) {
        API.kindUpdate.post(event).then((result) => {
            if (result.Succeed) {
                saved()
            } else {
                toast.error("更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <form className="grid items-start gap-6" onSubmit={kindUpdate} >
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
