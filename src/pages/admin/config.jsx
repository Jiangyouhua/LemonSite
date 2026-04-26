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
import { statusTags } from "@/lib/data"

const tableKeys = {
    Key: Seer("", "键", true),
    Value: Seer("", "值", true),
    Status: Seer("", "状态", true, (v) => statusTags[v].Name),
}

export default function ConfigPage() {
    const [loaded, setLoaded] = useState(false)
    const [open, setOpen] = useState(false)
    const [config, setConfig] = useState()
    const [, setNavs] = useLocalStorage("navs", [])

    const loadData = (offset, limit, key, value, back) => {
        API.configAll.get({ limit, offset, key, value }).then((result) => {
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

    const editDetail = (_config) => {
        setConfig(_config)
        setOpen(true)
    }

    const addItem = () => {
        let _config = { UserID: urlParams.get("user_id") }
        Object.entries(tableKeys).forEach(([k, v]) => {
            _config[k] = v.value
        })
        setConfig(_config)
        setOpen(true)
    }

    useEffect(() => {
        setNavs([
            { name: "用户管理", url: "/admin" },
            { name: "用户明细", url: "/admin/user" },
            { name: "系统配置", url: location },
        ])
    }, [setNavs])

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
                        <DialogTitle>{!config || !config.ID ? "新添内容" : "编辑内容，ID：" + config.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm data={config} saved={finishSave} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProfileForm({ data, saved, edit }) {
    const [item, setItem] = useState(data)
    const configUpdate = (event) => {
        API.configUpdate.submit(event).then((result) => {
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
        <form onSubmit={configUpdate}  className="grid items-start gap-6"  aria-disabled={!edit}>
            <ScrollArea className="h-140 m-[-12px] p-[12px]">
                <div >
                    <input type="hidden" name="ID" value={item.ID} />
                    <FormInput name={tableKeys.Key.name} column="Key" value={item.Key} />
                    <FormInput name={tableKeys.Value.name} column="Value" value={item.Value} />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={statusTags} />
                </div>
            </ScrollArea>
            <Button type="submit" >保存更新</Button>
        </form>
    )
}
