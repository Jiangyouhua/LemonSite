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
import CellImage from "@/components/cell-image"
import FormInput from "@/components/form-input"
import FormSelect from "@/components/form-select"
import FormTags from "@/components/form-tags"
import FormImage from "@/components/form-image"

const statusTags = ['未设置', '下线', '上线', '推广', '广告'].map((item, index) => { return { ID: index, Name: item } })
const kindTags = ['未设置', '积分', '价格'].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    ImageURL: Seer([], "产品图片", true, (v) => <CellImage url={!v || v.length < 1 ? "" : v[0]} />),
    Name: Seer("", "名称", true),
    Slogan: Seer("", "广告语", true),
    Description: Seer("", "说明", true),
    Promotional: Seer("", "促销语", true),
    Tags: Seer("", "分类标签", true),
    Kind: Seer("", "类型", true, (v) => kindTags[v].Name),
    Score: Seer(0, "积分", true),
    ScoreExplanation: Seer("", "积分说明", true),
    Price: Seer(0, "价格", true, (v) => (v / 100).toLocaleString("zh-CN", {style: "currency", currency: "CNY", minimumFractionDigits: 2, maximumFractionDigits: 2})),
    PriceExplanation: Seer("", "价格说明", true),
    Inventory: Seer("", "库存", true),
    IntroduceURL: Seer([], "推广图片", true, (v) => <CellImage url={!v || v.length < 1 ? "" : v[0]} />),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function GoodsPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [goods, setGoods] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "商品管理", url: "/admin" },
            { name: "商品明细", url: "/admin/goods" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.goodsAll.get({ limit, offset, key, value}).then((result) => {
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

    const editDetail = (_goods) => {
        setGoods(_goods)
        setOpen(true)
    }

    const addItem = () => {
        let _goods = {}
        Object.entries(tableKeys).forEach(([k, v]) => {
            _goods[k] = v.value
        })
        setGoods(_goods)
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
                <DialogTrigger>
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{!goods || goods.ID === 0 ? "新添内容" : "编辑内容，ID：" + goods.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm data={goods} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProfileForm({ data, saved }) {
    const [item, setItem] = useState(data)
    const goodsUpdate = (event) => {
        API.goodsUpdate.submit(event).then((result) => {
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

    const goodsPromotional = (back) => {
        API.goodsPromotional.get().then((result) => {
            if (result.Succeed) {
                back()
            } else {
                toast.error(result.Message)
            }
        })
    }

    const goodsTags = (back) => {
        API.goodsTags.get().then((result) => {
            if (result.Succeed) {
                back(result.Data)
            } else {
                console.error(result.Message)
            }
        })
    }

    return (
        <form onSubmit={goodsUpdate} className="grid items-start gap-6" id="form" >
            <ScrollArea className="h-140 m-[-16px] p-[16px]">
                <div>
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormImage name={tableKeys.ImageURL.name} column="ImageURL" value={item.ImageURL} count={10} />
                    <FormInput name={tableKeys.Slogan.name} column="Slogan" value={item.Slogan} />
                    <FormInput name={tableKeys.Description.name} column="Description" value={item.Description} />
                    <FormTags name={tableKeys.Tags.name} column="Tags" value={item.Tags} loadOptions={goodsTags} />
                    <FormTags name={tableKeys.Promotional.name} column="Promotional" value={item.Promotional} loadOptions={goodsPromotional} />
                    <FormSelect name={tableKeys.Kind.name} column="Kind" value={item.Kind} options={kindTags} />
                    <FormInput name={tableKeys.Score.name} column="Score" value={item.Score} type="number" />
                    <FormInput name={tableKeys.ScoreExplanation.name} column="ScoreExplanation" value={item.ScoreExplanation} />
                    <FormInput name={tableKeys.Price.name + "（单位：分）"} column="Price" value={item.Price} type="number" />
                    <FormInput name={tableKeys.PriceExplanation.name} column="PriceExplanation" value={item.PriceExplanation} />
                    <FormInput name={tableKeys.Inventory.name} column="Inventory" value={item.Inventory} type="number" />
                    <FormImage name={tableKeys.IntroduceURL.name} column="IntroduceURL" value={item.IntroduceURL} count={20} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" >保存更新</Button>
        </form>
    )
}
