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
const groupTags = ['超级管理员', '管理员', ' VIP用户', '用户'].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    ID: Seer(0, "ID", true),
    User: Seer(0, "用户", true, (v) => v.Name),
    Group: Seer(0, "用户组", true, (v) => groupTags[v].Name),
    Content: Seer("", "内容", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function MessageUserPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "信息管理", url: "/admin" },
            { name: "用户信息", url: "/admin/message_user" },
        ])
    }, [setNavs])

    const addItem = () => {
        let _message = {}
        Object.entries(tableKeys).forEach(([k, v]) => {
            _message[k] = v.value
        })
        setMessage(_message)
        setOpen(true)
    }

    const loadData = (offset, limit, key, value, back) => {
        API.messageToUser.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
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

    const editDetail = (_message) => {
        setMessage(_message)
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
                <DialogTrigger >
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{!message || message.ID === 0 ? "新添内容" : "编辑内容，ID：" + message.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={message} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const messageUpdate = (event) => {
        API.messageUpdate.submit(event).then((result) => {
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
        <form className="grid items-start gap-6" onSubmit={messageUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormSelect name={tableKeys.Group.name} column="Group" value={item.Group} options={groupTags} />
                    <FormInput name={tableKeys.Content.name} column="Content" value={item.Content} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
