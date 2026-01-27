import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/admin-header";
import AdminSider from "@/components/admin-sider";

export default function Admin({navs}) {
    return (
        <>
            <SidebarProvider>
                <AdminSider />
                <SidebarInset>
                    <AdminHeader navs={navs} />
                    <main>
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}