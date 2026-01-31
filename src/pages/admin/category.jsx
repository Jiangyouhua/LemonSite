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
import FormImage from "@/components/form-image"
import CellAvatar from "@/components/cell-avatar"

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { ID: index, Name: item } })
const tableKeys = {
    ID: Seer(0, "ID", true),
    Name: Seer("", "名称", true),
    Description: Seer("", "说明", true),
    ImageURL: Seer("", "页面图", true, (v) => <CellAvatar url={v} />),
    IconURL: Seer("", "类型ICON", true, (v) => <CellAvatar url={v} />),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function CategoryPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "打卡管理", url: "/admin" },
            { name: "打卡类型", url: "/admin/category" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.categoryAll.get({limit, offset, key, value}).then((result) => {
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

    const editDetail = (_category) => {
        setCategory(_category)
        setOpen(true)
    }

    const addItem = () => {
        let _category = {}
        Object.entries(tableKeys).forEach(([k, v]) => {
            _category[k] = v.value
        })
        setCategory(_category)
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
                        <DialogTitle>{!category || category.ID === 0 ? "新添内容" : "编辑内容，ID：" + category.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={category} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const categoryUpdate = (event) => {
        API.categoryUpdate.submit(event.target.parentElement).then((result) => {
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
        <form className="grid items-start gap-6"  >
            <ScrollArea className="h-140 m-[-12px] p-[12px]">
                <div >
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormImage name={tableKeys.IconURL.name} column="IconURL" value={item.IconURL} count={1} />
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Description.name} column="Description" value={item.Description} />
                    <FormImage name={tableKeys.ImageURL.name} column="ImageURL" value={item.ImageURL} count={1} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit"  onClick={categoryUpdate}>保存更新</Button>
        </form>
    )
}
