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

const playTags = [{ Value: false, Name: "未播放" }, { Value: true, Name: "已播放" }]
const loveTags = [{ Value: false, Name: "未点赞" }, { Value: true, Name: "已点赞" }]
const collectTags = [{ Value: false, Name: "未收藏" }, { Value: true, Name: "已收藏" }]
const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { Value: index, Name: item } })

const tableKeys = {
    User: Seer(0, "用户", true, (v) => v.Name),
    Drama: Seer(0, "剧集", true, (v) => v.Name),
    Play: Seer(false, "播放",   (v) => v ? "已播放" : "未播放" ),
    Love: Seer(false, "点赞",   (v) => v ? "已点赞" : "未点赞" ),
    Collect: Seer(false, "收藏", (v) =>   v ? "已收藏" : "未收藏"),
    Score: Seer(0, "评分", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function CarePage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [care, setCare] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "短剧管理", url: "/admin" },
            { name: "短剧评分等", url: "/admin/care" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.careAll.get({limit, offset, key, value}).then((result) => {
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

    const editDetail = (_care) => {
        setCare(_care)
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
                        <DialogTitle>{!care || !care.ID ? "新添内容" : "编辑内容，ID：" + care.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm data={care} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProfileForm({ data, saved }) {
    const [item, setItem] = useState(data)
    const careUpdate = (event) => {
        API.careUpdate.submit(event).then((result) => {
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
        <form onSubmit={careUpdate} className="grid items-start gap-6"  >
            <ScrollArea className="h-140 m-[-12px] p-[12px]">
                <div >
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormSelect name={tableKeys.Play.name} column="Play" value={item.Play} options={playTags} block={true} />
                    <FormSelect name={tableKeys.Love.name} column="Love" value={item.Love} options={loveTags} block={true} />
                    <FormSelect name={tableKeys.Collect.name} column="Collect" value={item.Collect} options={collectTags} block={true} />
                    <FormInput name={tableKeys.Score.name} column="Score" value={item.Score} type="number" block={true} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" >保存更新</Button>
        </form>
    )
}
