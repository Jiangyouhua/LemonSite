'use client'
import { useLocation } from "react-router-dom"
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

export default function AdminHeader() {
    const location = useLocation();
    const pathname = location.pathname
    const items = pathname.split("/")
    items.shift()
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
                        {items.map((_, index) => (
                           <ItemRow key={index} items={items} index={index} />
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

export function ItemRow({ items, index }) {
    const item = items[index]
    return (
        <>
            <RightArrow index={index} />
            <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={"/" + items.slice(0, index + 1).join("/")}>
                    {item}
                </BreadcrumbLink>
            </BreadcrumbItem>
        </>
    )
}

export function RightArrow({ index }) {
    if (index > 0) {
        return (<BreadcrumbSeparator className="hidden md:block" />)
    }
    return <></>
}