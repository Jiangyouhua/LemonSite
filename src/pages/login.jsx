import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { API } from "@/src/API"
import { useLocalStorage } from "@uidotdev/usehooks";
import SiteLogo from "@/components/site-logo"

export default function LoginPage() {
    const [, setUser] = useLocalStorage("user")
    const [, setAuth] = useLocalStorage("auth")

    const handleSubmit = (event) => {
        event.preventDefault()
        API.login.submit(event)
            .then((result) => {
                if (result.Succeed) {
                    const data = result.Data
                    setUser(data);
                    setAuth(!!data.Token && data.Token.length > 0)
                    localStorage.setItem("token", data.Token)
                    window.location = "/admin"
                    toast.success("登录成功")
                } else {
                    toast.error("邮箱或密码错误")
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }
    return (
        <div className="grid grid-cols-2 gap-0">
            <div className="col-span-1 h-screen content-center text-center items-center gap-6 ">
                <div className="absolute left-0 top-0 m-8">
                    <SiteLogo />
                </div>
                <div className="flex flex-col max-w-full items-center">
                    <form className="gap-6 w-xs" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h1 className="text-2xl font-bold">登录您的账号</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    如没相关权限，请联系管理员
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">邮箱</FieldLabel>
                                <Input id="email" name="email" type="email" required />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">密码</FieldLabel>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </Field>
                            <Field>
                                <Button type="submit">登录</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
            </div>
            <div className="col-span-1 h-screen items-center gap-6 bg-[url(/images/login-back.svg)] bg-no-repeat bg-cover">
            </div>
        </div>
    )
}