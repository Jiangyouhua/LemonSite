
import * as React from "react"
import { AdminMenu } from "@/components/admin-menu"
import { AdminOption } from "@/components/admin-option"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AdminLogo } from "./admin-logo"

export default function AdminSider({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminLogo />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <AdminMenu />
      </SidebarContent>
      <SidebarFooter>
        <small className="text-center">Version 1.0.0 </small>
        {/* <AdminOption /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  ) 
}
