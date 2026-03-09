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
import FormDate from "@/components/form-date"
import CellImage from "@/components/cell-image"
import { Share } from "lucide-react"

const statusTags = ['未设置', '下线', '上线', '推广', '广告'].map((item, index) => { return { Value: index, Name: item } })

const tableKeys = {
    Name: Seer("", "名称", true),
    Author: Seer("", "出版方", true),
    ImageURL: Seer([], "产品图片", true, (v) => <CellImage url={v} />),
    ReleaseDate: Seer("", "发布日期", true),
    Slogan: Seer("", "广告语", true),
    Description: Seer("", "简介", true),
    Promotional: Seer("", "促销词", true),
    Tags: Seer("", "分类标签", true),
    ChapterCount: Seer(0, "章节数", true),
    Play: Seer(0, "播放数", true),
    Share: Seer(0, "分享数", true),
    Score: Seer(0, "评分", true),
    Love: Seer(0, "喜欢数", true),
    Collect: Seer(0, "收藏数", true),
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
        API.dramaAll.get({ limit, offset, key, value}).then((result) => {
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
         toast.success("成功保存更新的内容")
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
                actions={[{ name: "编辑内容", func: editDetail }, {name: "编辑章节", func: editChildren }]}
                addItem={addItem}
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{!drama || !drama.ID ? "新添内容" : "编辑内容，ID：" + drama.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm data={drama} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProfileForm({ data, saved }) {
    const [item, setItem] = useState(data)
    const dramaUpdate = (event) => {
        API.dramaUpdate.submit(event).then((result) => {
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

    const dramaPromotional = (back) => {    
        API.dramaPromotional.get().then((result) => {
            if (result.Succeed) {
                back(result.Data)
            } else {
                console.error(result.Message)
            }
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
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormImage name={tableKeys.ImageURL.name} column="ImageURL" value={item.ImageURL} count={9} />
                    <FormInput name={tableKeys.Author.name} column="Author" value={item.Author} />
                    <FormDate name={tableKeys.ReleaseDate.name} column="ReleaseDate" value={item.ReleaseDate} />
                    <FormInput name={tableKeys.Slogan.name} column="Slogan" value={item.Slogan} />
                    <FormInput name={tableKeys.Description.name} column="Description" value={item.Description} />
                    <FormTags name={tableKeys.Promotional.name} column="Promotional" value={item.Promotional} loadOptions={dramaPromotional} />
                    <FormTags name={tableKeys.Tags.name} column="Tags" value={item.Tags} loadOptions={dramaTags} />
                    <FormInput name={tableKeys.ChapterCount.name} column="ChapterCount" value={item.ChapterCount} type="number" />
                    <FormInput name={tableKeys.Score.name} column="Score" value={item.Score} type="number" step="0.1" />
                    <FormInput name={tableKeys.Play.name} column="Play" value={item.Play} type="number" />
                    <FormInput name={tableKeys.Share.name} column="Share" value={item.Share} type="number" />
                    <FormInput name={tableKeys.Love.name} column="Love" value={item.Love} type="number" />
                    <FormInput name={tableKeys.Collect.name} column="Collect" value={item.Collect} type="number" />
                    <FormInput name={tableKeys.Recommendation.name} column="Recommendation" value={item.Recommendation} type="number" />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" >保存更新</Button>
        </form>
    )
}
