import AdminTable from "@/components/admin-table"
import { toast } from "sonner"
import { API } from "@/lib/api"
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
import { useState } from "react"
import FormAvatar from "@/components/Form-avatar"
import FormText from "@/components/form-text"
import FormInput from "@/components/form-input"
import FormSelect from "@/components/form-select"
import CellAvatar from "@/components/cell-avatar"
import FormTags from "@/components/form-tags"

const statusTags = ['未设置', '下线', '上线', '推广', '广告'].map((item, index) => {return {ID:index, Name: item}})

const tableKeys = {
    ID: Seer(0, "ID", true),
    ImageURL: Seer("", "产品图片", true, (v) => <CellAvatar url={v} />),
    Name: Seer("", "名称", true),
    Slogan: Seer("", "广告语", true),
    Description: Seer("", "说明", true),
    Promotional: Seer("", "促销语", true),
    Tags: Seer("", "分类标签", true),
    Price: Seer(0, "价格", true,  (v) => v.toFixed(2)),
    PriceExplanation: Seer("", "价格说明", true),
    Inventory: Seer("", "库存", true),
    IntroduceURL: Seer("", "推广图片", true, (v) => <CellAvatar url={v} /> ),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function GoodsPage() {
    const [open, setOpen] = useState(false)
    const [goods, setGoods] = useState()
    const [data, setData] = useState({ total: 0, items: [] })
    const [pagination, setPagination] = useState({offset:0, limit: 0, key: "", value:""})

    const loadData = (offset, limit, key, value, back) => {
        API.goodsAll.get({ limit: limit, offset: offset }).then((result) => {
            if (result.Succeed) {
                setPagination({offset:offset, limit: limit, key: key, value:value})
                setData(result.Data)
                back(result.Data.total)
            } else {
                toast.error("邮箱或密码错误")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    const finishSave = function () {
        loadData(pagination.offset, pagination.limit, pagination.key, pagination.value, function () {
            setOpen(false)
        })
    }

    const showDetail = (_goods) => {
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
            <Dialog open={open} onOpenUpdate={setOpen}>
                <DialogTrigger asChild>
                    <AdminTable
                        total={data.total}
                        items={data.items}
                        dict={tableKeys}
                        loadData={loadData}
                        showDetail={showDetail}
                        addItem={addItem}
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>商品信息</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={goods} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const [load, setLoad] = useState(false)

    const goodsUpdate = function (event) {
        API.goodsUpdate.post(event).then((result) => {
            if (result.Succeed) {
                saved()
            } else {
                toast.error("更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    const goodsPromotional = function (back) {
        API.goodsPromotional.get().then((result) => {
            if (result.Succeed) {
                if (!result.Data) {
                    return 
                }
                back(result.Data)
            } else {
                toast.error(result.Message)
            }
        })
    }

    const goodsTags = function (back) {
        API.goodsTags.get().then((result) => {
            if (result.Succeed) {
                if (!result.Data) {
                    return 
                }
                back(result.Data)
            } else {
                console.error(result.Message)
            }
        })
    }

    if (!load){
        setLoad(true)
        goodsTags()
        goodsPromotional()
    }

    return (
        <form className="grid items-start gap-6" onSubmit={goodsUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <div className="text-center">
                        <FormAvatar name={item.Name} column="ImageURL" value={item.ImageURL} />
                        <FormText name="ID" column="ID" value={item.ID} />
                    </div>
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormInput name={tableKeys.Slogan.name} column="Slogan" value={item.Slogan} />
                    <FormInput name={tableKeys.Description.name} column="Description" value={item.Description} />
                    <FormTags name={tableKeys.Promotional.name} column="Promotional" value={item.Promotional} optionWords={goodsPromotional} />
                    <FormTags name={tableKeys.Tags.name} column="Tags" value={item.Tags} optionWords={goodsTags} />
                    <FormInput name={tableKeys.Price.name} column="Price" value={item.Price} type="number" />
                    <FormInput name={tableKeys.PriceExplanation.name} column="PriceExplanation" value={item.PriceExplanation} />
                    <FormInput name={tableKeys.Inventory.name} column="Inventory" value={item.Inventory} type="number" />
                    <FormAvatar name={tableKeys.IntroduceURL.name} column="IntroduceURL" value={item.IntroduceURL} isImage={true} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
