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
import FormTags from "@/components/form-tags"
import FormImage from "@/components/form-image"
import CellImage from "@/components/cell-image"

const statusTags = ['未设置', '下线', '上线', '推广', '广告'].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    Name: Seer("", "名称", true),
    Author: Seer("", "作者", true),
    Publisher: Seer("", "出版社", true),
    ISBN: Seer("", "ISBN", true),
    ImageURL: Seer([], "产品图片", true, (v) => <CellImage url={v} />),
    ReleaseDate: Seer("", "发布日期", true),
    Slogan: Seer("", "广告语", true),
    Description: Seer("", "说明", true),
    Promotional: Seer("", "促销语", true),
    Tags: Seer("", "分类标签", true),
    ChatperCount: Seer(0, "章节数", true),
    Score: Seer(0, "评分", true),
    Like: Seer(0, "喜欢数", true),
    Collect: Seer(0, "收藏数", true),
    Play: Seer(0, "播放数", true),
    Recommendation: Seer(0, "推荐数", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function DramaPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [drama, setDrama] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "短剧管理", url: "/admin" },
            { name: "短剧明细", url: "/admin/drama" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.dramaAll.get({ limit: limit, offset: offset }).then((result) => {
            setLoaded(true)
            if (result.Succeed) {
                back(result.Data)
            } else {
                toast.error("数据加载失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    const finishSave = () => {
        setLoaded(false)
    }

    const editDetail = (_drama) => {
        setDrama(_drama)
        setOpen(true)
    }

    const editChildren = (_drama) => {
        window.location = "/admin/chapter?drama_id=" + _drama.ID + "&drama_name=" + encodeURIComponent(_drama.Name)
    }

    const addItem = () => {
        let _drama = {}
        Object.entries(tableKeys).forEach(([k, v]) => {
            _drama[k] = v.value
        })
        setDrama(_drama)
        setOpen(true)
    }

    return (
        <div className="mx-4 w-auto">
            <AdminTable
                loaded={loaded}
                dict={tableKeys}
                loadData={loadData}
                actions={[{ name: "编辑内容", func: editDetail }]}
                editChildren={editChildren}
                addItem={addItem}
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{!drama || drama.ID === 0 ? "新添内容" : "编辑内容，ID：" + drama.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm data={drama} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProfileForm({ data, saved }) {
    const dramaUpdate = (event) => {
        API.dramaUpdate.submit(event).then((result) => {
            if (result.Succeed) {
                saved()
            } else {
                toast.error("数据更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    const dramaTags = (back) => {
        API.dramaTags.get().then((result) => {
            if (result.Succeed) {
                back(result.Data)
            } else {
                console.error(result.Message)
            }
        })
    }

    return (
        <form onSubmit={dramaUpdate} className="grid items-start gap-6"  >
            <ScrollArea className="h-140 m-[-12px] p-[12px]">
                <div >
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormImage name={tableKeys.ImageURL.name} column="ImageURL" value={item.ImageURL} count={9} />
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Author.name} column="Author" value={item.Author} />
                    <FormInput name={tableKeys.Publisher.name} column="Publisher" value={item.Publisher} />
                    <FormInput name={tableKeys.ISBN.name} column="ISBN" value={item.ISBN} />
                    <FormInput name={tableKeys.ReleaseDate.name} column="ReleaseDate" value={item.ReleaseDate} type="date" />
                    <FormInput name={tableKeys.Slogan.name} column="Slogan" value={item.Slogan} />
                    <FormInput name={tableKeys.Description.name} column="Description" value={item.Description} />
                    <FormTags name={tableKeys.Tags.name} column="Tags" value={item.Tags} loadOptions={dramaTags} />
                    <FormInput name={tableKeys.ChatperCount.name} column="ChatperCount" value={item.ChatperCount} type="number" />
                    <FormInput name={tableKeys.Score.name} column="Score" value={item.Score} type="number" step="0.1" />
                    <FormInput name={tableKeys.Like.name} column="Like" value={item.Like} type="number" />
                    <FormInput name={tableKeys.Collect.name} column="Collect" value={item.Collect} type="number" />
                    <FormInput name={tableKeys.Play.name} column="Play" value={item.Play} type="number" />
                    <FormInput name={tableKeys.Recommendation.name} column="Recommendation" value={item.Recommendation} type="number" />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" >保存更新</Button>
        </form>
    )
}
