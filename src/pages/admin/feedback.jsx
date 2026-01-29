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

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    ID: Seer(0, "ID", true),
    UserID: Seer(0, "用户ID"),
    Content: Seer("", "反馈内容", true),
    Reply: Seer("", "回复内容", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function FeedbackPage() {
    const [open, setOpen] = useState(false)
    const [feedback, setFeedback] = useState()
    const [data, setData] = useState({ Total: 0, Items: [] })
    const [pagination, setPagination] = useState({ offset: 0, limit: 0, key: "", value: "" })
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "用户管理", url: "/admin" },
            { name: "意见反馈", url: "/admin/feedback" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.feedbackAll.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
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

    const editDetail = (_feedback) => {
        setFeedback(_feedback)
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
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{ !feedback || feedback.ID === 0 ? "新添内容" : "编辑内容，ID：" + feedback.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={feedback} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const feedbackUpdate = function (event) {
        API.feedbackUpdate.submit(event).then((result) => {
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
        <form className="grid items-start gap-6" onSubmit={feedbackUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <input type="hidden" name="ID" value={item.id} />
                    <FormInput name={tableKeys.Content.name} column="Content" value={item.Content} block={true} />
                    <FormInput name={tableKeys.Reply.name} column="Reply" value={item.Reply} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
