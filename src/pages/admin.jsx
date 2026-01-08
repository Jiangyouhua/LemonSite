import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/admin-header";
import AdminSider from "@/components/admin-sider";
import { Toaster } from "@/components/ui/sonner"

export default function Admin() {
    return (
        <>
            <Toaster />
            <SidebarProvider>
                <AdminSider />
                <SidebarInset>
                    <AdminHeader />
                    <main>
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}