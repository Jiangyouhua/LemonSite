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

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { ID: index, Name: item } })
// {name: 表头显示名称， show:表列是否显示，cell: 表列格式}
const tableKeys = {
    ID: Seer(0, "ID", true),
    UserID: Seer(0, "用户ID"),
    Name: Seer("", "收件人", true),
    Bank: Seer("", "银行", true),
    Branch: Seer("", "分行", true),
    Account: Seer("", "账号", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function BankPage() {
    const [open, setOpen] = useState(false)
    const [bank, setBank] = useState()
    const [data, setData] = useState({ total: 0, items: [] })
    const [pagination, setPagination] = useState({offset:0, limit: 0, key: "", value:""})

    const loadData = (offset, limit, key, value, back) => {
        API.bankAll.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
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

    const showDetail = (_bank) => {
        setBank(_bank)
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
                    <ProfileForm item={bank} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const bankUpdate = function (event) {
        API.bankUpdate.post(event).then((result) => {
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
        <form className="grid items-start gap-6" onSubmit={bankUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <div className="text-center">
                        <FormText name="ID" column="ID" value={item.ID} />
                    </div>
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Bank.name} column="Bank" value={item.Bank} />
                    <FormInput name={tableKeys.Branch.name} column="Branch" value={item.Branch} />
                    <FormInput name={tableKeys.Account.name} column="Account" value={item.Account} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
