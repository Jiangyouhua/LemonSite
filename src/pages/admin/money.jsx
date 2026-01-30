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

const statusTags = ['未设置', '待处理', '已处理'].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    ID: Seer(0, "ID", true),
    UserID: Seer(0, "用户ID"),
    BankID: Seer(0, "银行ID"),
    Amonut: Seer(0, "金额", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function MoneyPage({ kind, name, url }) {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [money, setMoney] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "现金管理", url: "/admin" },
            { name: name, url: url },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        ({ "topup": API.moneyTopUp, "withdrawal": API.moneyWithdrawal })[kind].get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
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
        setOpen(false)
    }

    const editDetail = (_money) => {
        setMoney(_money)
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
                <DialogTrigger >
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{!money || money.ID === 0 ? "新添内容" : "编辑内容，ID：" + money.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={money} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const moneyUpdate = (event) => {
        API.moneyUpdate.submit(event).then((result) => {
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
        <form className="grid items-start gap-6" onSubmit={moneyUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormInput name={tableKeys.Amonut.name} column="Amonut" value={item.Amonut} block={true} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
