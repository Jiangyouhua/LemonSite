import AdminTable from "@/components/admin-table"
import { toast } from "sonner"
import { API } from "../../../lib/api"
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
import FormImage from "@/components/form-image"
import FormText from "@/components/form-text"
import FormInput from "@/components/form-input"
import FormSelect from "@/components/form-select"

export default function UsersPage() {
    const tableKeys = {
        ID: "ID",
        Name: "姓名",
        Phone: "手机",
        Email: "邮箱",
        Score: "积分",
        Money: "金额",
        Cash: "提现",
        Status: "状态"
    }

    const [open, setOpen] = useState(false)
    const [user, setUser] = useState()
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(0)
    const [data, setData] = useState({total:0, users:[]})

    const loadData = (offset, limit, back) => {
        API.userAll.get({ limit: limit, offset: offset }).then((result) => {
            if (result.Succeed) {
                setOffset(offset)
                setLimit(limit)
                setData(result.Data)
                back(result.Data.total)
            } else {
                toast.error("邮箱或密码错误")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    const savedData = function(){
        loadData(offset, limit, function(){
            setOpen(false)
        })
    }

    const showDetail = (_user) => {
        setUser(_user)
        setOpen(true)
    }

    return (
        <div className="mx-4 w-auto">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <AdminTable total={data.total} items={data.users} dict={tableKeys} loadData={loadData} showDetail={showDetail} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>用户信息</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={user} saved={savedData}/>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved}) {
    const changeUser = function (event) {
        API.changeUser.post(event).then((result) => {
            if (result.Succeed) {
                const user = result.Data
                localStorage.setItem("user", JSON.stringify(user))
                toast.success("更新成功")
                saved()
            } else {
                toast.error("更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <form className="grid items-start gap-6" onSubmit={changeUser} >
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <div className="text-center">
                        <FormImage name="头像" holder={item.Name} value={item.AvatarURL} />
                        <FormText name="ID" column="ID" value={item.ID} />
                    </div>
                    <FormInput name="姓名" column="Name" value={item.Name} />
                    <FormInput name="真实姓名" column="RealName" value={item.RealName} />
                    <FormInput name="手机号码" column="Phone" value={item.Phone} />
                    <FormInput name="邮箱" column="Email" value={item.Email} />
                    <FormInput name="登录密码" column="LoginPassword" value="" />
                    <FormInput name="交易密码" column="RransactionPassword" value="" />
                    <FormInput name="积分" column="Score" value={item.Score} />
                    <FormInput name="金额" column="Money" value={item.Money} />
                    <FormInput name="提现" column="Cash" value={item.Cash} />
                    <FormSelect name="状态" column="Status" value={item.Status} tags={['会员', '管理员', '超级管理员', '冻结']} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
