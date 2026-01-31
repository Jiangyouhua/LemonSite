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
    Bank: Seer("", "银行", true),
    Branch: Seer("", "分行", true),
    Account: Seer("", "账号", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function BankPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [bank, setBank] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "用户管理", url: "/admin" },
            { name: "用户明细", url: "/admin/user" },
            { name: `${urlParams.get("user_name")}的银行账号`, url: location },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.bankUser.get({limit, offset, key, value}).then((result) => {
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
        setLoaded(false)
    }

    const editDetail = (_bank) => {
        setBank(_bank)
        setOpen(true)
    }

    const addItem = () => {
        let _bank = { UserID: urlParams.get("user_id") }
        Object.entries(tableKeys).forEach(([k, v]) => {
            _bank[k] = v.value
        })
        setBank(_bank)
        setOpen(true)
    }

    return (
        <div className="mx-4 w-auto">
            <AdminTable
                loaded={loaded}
                dict={tableKeys}
                loadData={loadData}
                actions={[{ name: "编辑内容", func: editDetail }]}
                addItem={addItem}
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{!bank || bank.ID === 0 ? "新添内容" : "编辑内容，ID：" + bank.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={bank} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved, edit }) {
    const bankUpdate = (event) => {
        API.bankUpdate.submit(event.target.parentElement).then((result) => {
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
        <form className="grid items-start gap-6"  aria-disabled={!edit}>
            <ScrollArea className="h-140 m-[-12px] p-[12px]">
                <div >
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Bank.name} column="Bank" value={item.Bank} />
                    <FormInput name={tableKeys.Branch.name} column="Branch" value={item.Branch} />
                    <FormInput name={tableKeys.Account.name} column="Account" value={item.Account} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" onClick={bankUpdate}>保存更新</Button>
        </form>
    )
}
