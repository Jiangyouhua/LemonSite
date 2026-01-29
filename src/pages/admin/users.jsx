import { useEffect, useState } from "react"
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
import FormAvatar from "@/components/Form-avatar"
import CellAvatar from "@/components/cell-avatar"
import { StatusTags } from "@/lib/data"

const groupTags = ['超级管理员', '管理员', ' VIP用户', '用户'].map((item, index) => { return { ID: index, Name: item } })

const tableKeys = {
    ID: Seer(0, "ID", true),
    AvatarURL: Seer("", "头像", true, (v) => <CellAvatar url={v} />),
    Name: Seer("", "姓名", true),
    RealName: Seer("", "真实姓名", true),
    CardID: Seer("", "身份证号码"),
    Phone: Seer("", "手机", true),
    Email: Seer("", "邮箱", true),
    LoginPassword: Seer("", "登录密码"),
    TransactionPassword: Seer("", "交易密码"),
    Score: Seer(0, "积分", true),
    Money: Seer(0, "金额", true),
    Withdrawal: Seer(0, "提现", true),
    TopUp: Seer(0, "充值", true),
    AddressID: (0, "默认地址ID"),
    BankID: (0, "默认银行ID"),
    Alipay: Seer("", "支付宝"),
    Weichat: Seer("", "微信"),
    Token: Seer("", "Token"),
    Group: Seer(0, "用户组", true, (v) => groupTags[v].Name),
    Status: Seer("", "状态", true, (v) => StatusTags[v].Name),
}

export default function UsersPage() {
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState()
    const [data, setData] = useState({ Total: 0, Items: [] })
    const [pagination, setPagination] = useState({ offset: 0, limit: 0, key: "", value: "" })
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        setNavs([
            { name: "用户管理", url: "/admin" },
            { name: "用户明细", url: "/admin/user" },
        ])
    }, [setNavs])

    const loadData = (offset, limit, key, value, back) => {
        API.userAll.get({ limit: limit, offset: offset, key: key, value: value }).then((result) => {
            if (result.Succeed) {
                setPagination({ offset: offset, limit: limit, key: key, value: value })
                setData(result.Data)
                back(result.Data.Total)
            } else {
                toast.error("数据加载失败，请稍后再试")
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

    const editDetail = (_user) => {
        setUser(_user)
        setOpen(true)
    }

    const showAddress = (_user) => {
        window.location = "/admin/address?user_id=" + _user.ID + "&user_name=" + _user.Name
    }

    const showBank = (_user) => {
        window.location = "/admin/bank?user_id=" + _user.ID + "&user_name=" + _user.Name
    }

    const addItem = () => {
        let _user = {Addresses:[], Banks: []}
        Object.entries(tableKeys).forEach(([k, v]) => {
            _user[k] = v.value
        })
        setUser(_user)
        setOpen(true)
    }

    return (
        <div className="mx-4 w-auto">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <AdminTable
                        total={data.Total}
                        items={data.Items}
                        dict={tableKeys}
                        loadData={loadData}
                        actions={[ { name: "编辑内容", func: editDetail }, { name: "收货地址", func: showAddress }, { name: "银行账号", func: showBank },]}
                        addItem={addItem}
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>{ !user || user.ID === 0 ? "新添内容" : "编辑内容，ID：" + user.ID}</DialogTitle>
                        <DialogDescription>点击锁图标，可编辑</DialogDescription>
                    </DialogHeader>
                    <ProfileForm item={user} saved={finishSave} /> 
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ProfileForm({ item, saved, edit }) {
    const [user, setUser] = useLocalStorage("user")
    const userUpdate = function (event) {
        API.userUpdate.submit(event).then((result) => {
            if (result.Succeed) {
                if (result.Data.ID === user.ID) {
                    setUser(result.Data)
                }
                saved()
            } else {
                toast.error("数据数据更新失败，请稍后再试")
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <form className="grid items-start gap-6" onSubmit={userUpdate} aria-disabled={!edit}>
            <ScrollArea className="w-auto, h-140 m-[-12px] p-[12px]">
                <div className="px-[4px] ">
                    <div className="text-center">
                        <FormAvatar name="头像" column="AvatarURL" holder={item.Name} value={item.AvatarURL} />
                    </div>
                    <input type="hidden" name="ID" value={item.id} />
                    <FormInput name={tableKeys.Name.name} column="Name" value={item.Name} block={true}/>
                    <FormInput name={tableKeys.RealName.name} column="RealName" value={item.RealName} block={true} />
                    <FormInput name={tableKeys.Phone.name} column="Phone" value={item.Phone} block={true}/>
                    <FormInput name={tableKeys.Email.name} column="Email" value={item.Email} />
                    <FormInput name={tableKeys.LoginPassword.name} column="LoginPassword" value="" />
                    <FormInput name={tableKeys.TransactionPassword.name} column="TransactionPassword" value="" />
                    <FormSelect name="默认地址" column="AddressID" value={item.AddressID} options={item.Addresses.map((address) => ({ ID: address.ID, Name: `${address.Name} - ${address.Phone} - ${address.Province} ${address.City} ${address.District} ${address.Detail}` }))} />
                    <FormSelect name="默认银行" column="BankID" value={item.BankID} options={item.Banks.map((bank) => ({ ID: bank.ID, Name: `${bank.Name} -  ${bank.Bank} ${bank.Branch} - ${bank.Account}` }))} />
                    <FormInput name={tableKeys.Score.name} column="Score" value={item.Score} type="number" />
                    <FormInput name={tableKeys.Money.name} column="Money" value={item.Money} type="number" />
                    <FormInput name={tableKeys.Withdrawal.name} column="Withdrawal" value={item.Withdrawal} type="number" />
                    <FormSelect name={tableKeys.Status.name} column="Status" value={item.Status} options={StatusTags} />
                </div>
            </ScrollArea>
            <Button type="submit">保存更新</Button>
        </form>
    )
}
