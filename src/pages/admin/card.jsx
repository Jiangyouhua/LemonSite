import { useState } from "react"
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

import AdminTable from "@/components/admin-table"
import FormText from "@/components/form-text"
import FormInput from "@/components/form-input"
import FormSelect from "@/components/form-select"

const statusTags = ['未设置', '未启用', '已启用'].map((item, index) => { return { ID: index, Name: item } })
const repeatTags = ['未设置', '日', '周', '月', '年'].map((item, index) => {return {ID:index, Name: item}})
const tableKeys = {
    ID: Seer(0, "ID", true),
    KindID: Seer(0, "分类ID"),
    Kind: Seer("", "类型",true, (v) => v.Name),
    Name: Seer("", "名称", true),
    StartTime: Seer(0,"开始时间", true,  (v) => v+":00" ),
    EndTime: Seer(0,"开始时间", true,  (v) => v+":00" ),
    Score: Seer(0, "积分", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function CardPage() {
    const [open, setOpen] = useState(false)
    const [card, setCard] = useState()
    const [data, setData] = useState({ total: 0, items: [] })
    const [pagination, setPagination] = useState({offset:0, limit: 0, key: "", value:""})

    const loadData = (offset, limit, key, value, back) => {
        API.cardAll.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
            if (result.Succeed) {
                setPagination({offset:offset, limit: limit, key: key, value:value})
                setData(result.Data)
                back(result.Data.total)
            } else {
                toast.error("邮箱或密码错误")
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

    const showDetail = (_card) => {
        setCard(_card)
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
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>用户信息</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={card} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved }) {
    const [loaded, setLoaded] = useState(false)
    const [kind, setKind] = useState([])
    const cardUpdate = function (event) {
        API.cardUpdate.post(event).then((result) => {
            if (result.Succeed) {
                saved()
            } else {
                toast.error("更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    if (!loaded) {
        setLoaded(true)
        API.kindAll.get({ limit: 100, offset: 0, key: "", value: "" }).then((result) => {
            if (result.Succeed) {
                setKind(result.Data.items)
            } else {
                toast.error("邮箱或密码错误")
            }
        }).catch((error) => {
            toast.error(error)
        })
    }

    return (
        <form className="grid items-start gap-6" onSubmit={cardUpdate} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <div className="text-center">
                        <FormText name="ID" column="ID" value={item.ID} />
                    </div>
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} />
                    <FormSelect name={tableKeys.Kind.name} column="KindID" value={item.KindID} options={kind.items}/>
                    <FormInput type="number" name={tableKeys.StartTime.name} column="StartTime" value={item.StartTime} />
                    <FormInput type="number" name={tableKeys.EndTime.name} column="EndTime" value={item.EndTime} />
                    <FormSelect name={tableKeys.Repeat.name} column="Repeat" value={item.Repeat} options={repeatTags} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
