'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import AdminUser from "@/components/admin-user"

export default function AdminHeader({ navs }) {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {navs.map((nav, index) => (
                            <NavItem key={"nav_" + index} nav={nav} index={index} />
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>

            </div>
            <div className="item-right text-right">
                <AdminUser className="hidden sm:flex" />
            </div>
        </header>
    )
}

function NavItem({ nav, index }) {
    if (!nav) {
        return <></>
    }
    return (
        <>
            {index > 0 ? <BreadcrumbSeparator /> : <></>}
            <BreadcrumbItem>
                <BreadcrumbLink href={nav.url}>
                    {nav.name}
                </BreadcrumbLink>
            </BreadcrumbItem>
        </>
    )
}