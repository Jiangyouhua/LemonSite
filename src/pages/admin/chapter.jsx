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

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { Value: index, Name: item } })

const tableKeys = {
    Name: Seer("", "剧集名称", true),
    Number: Seer(0, "章节编号", true),
    ContentURL: Seer("", "内容地址", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function ChapterPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [chapter, setChapter] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "短剧管理", url: "/admin" },
            { name: "短剧明细", url: "/admin/drama" },
            { name: `《${urlParams.get("drama_name")}》短剧章节`, url: location.href },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.chapterDrama.get({limit, offset, key, value}).then((result) => {
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

    const editDetail = (_chapter) => {
        setChapter(_chapter)
        setOpen(true)
    }

    const addItem = () => {
        let _chapter = { DramaID: urlParams.get("drama_id") }
        Object.entries(tableKeys).forEach(([k, v]) => {
            _chapter[k] = v.value
        })
        setChapter(_chapter)
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
                        <DialogTitle>{!chapter || !chapter.ID ? "新添内容" : "编辑内容，ID：" + chapter.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm data={chapter} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProfileForm({ data, saved }) {
    const [item, setItem] = useState(data)
    const chapterUpdate = (event) => {
        API.chapterUpdate.submit(event).then((result) => {
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
        <form onSubmit={chapterUpdate} className="grid items-start gap-6"  >
            <ScrollArea className="h-140 m-[-12px] p-[12px]">
                <div >
                    <input type="hidden" name="ID" value={item.ID} />
                    <input type="hidden" name="DramaID" value={item.DramaID} />
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Number.name} column="Number" value={item.Number} type="number" />
                    <FormInput name={tableKeys.ContentURL.name} column="ContentURL" value={item.ContentURL} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" >保存更新</Button>
        </form>
    )
}
