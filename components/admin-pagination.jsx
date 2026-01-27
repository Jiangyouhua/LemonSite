import { useState } from "react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function AdminPagination({total, limit, page, loadData}){
    const [pageTotal, setPageTotal] = useState(0) // 页面总数
    const [pageTags, setPageTags] = useState([]) // 可操作页面

     const limitUpdate = function (value) {
        const _limie = +value
        pageTagsFormat(page, _limie, total)
        loadData(page, limit, back)
    }

    const pageUpdate = function (action, number) {
        let p = action == 0 ? number : page + action
        const _page = Math.max(0, Math.min(p, pageTotal))
        pageTagsFormat(_page, limit, total)
        if (_page !== page) {
            loadData(_page, limit, back)
        }
    }

    const pageTagsFormat = function (_index, _limit, _total) {
        const max = _total % _limit == 0 ? total / _limit - 1 : total / _limit
        const start = Math.max(0, _index - 2)
        const end = Math.min(max, _index + 2)
        let p = []
        for (let i = start; i <= end; i++) {
            p.push(i)
        }
        if (max != limit) {
            setPageTotal(max)
        }
        setPageTags([...p])
    }

    const back = function (_total) {
        pageTagsFormat(page, limit, _total)
    }
    
    return (
        <div className="flex items-center py-4">
                <LimitSelecter limit={limit} limitUpdate={limitUpdate} />
                <div className="flex w-full"></div>
                <PaginationTabler current={page} pages={pageTags} pageTotal={pageTotal} pageUpdate={pageUpdate} />
            </div>
    )
}

function LimitSelecter({ limit, limitUpdate }) {
    return (
        <div className="hidden items-center gap-4 lg:flex w-126">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                每页行数
            </Label>
            <Select value={limit + ''} onValueChange={(_value) => { limitUpdate(_value) }}>
                <SelectTrigger id="rows-per-page" className="w-20" >
                    <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent side="top">
                    {[10, 20, 50, 100].map((pageSize) => (
                        <SelectItem key={"limit_" + pageSize} value={`${pageSize}`}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

function PaginationTabler({ current, pages, pageTotal, pageUpdate }) {
    return (
        <div className="text-right">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => { pageUpdate(-1, 0) }} />
                    </PaginationItem>
                    {pages[0] === 0 ? (<></>) : (<PaginationItem> <PaginationEllipsis /> </PaginationItem>)}
                    {pages.map((index) => {
                        return (
                            <PaginationItem key={'page_' + index}>
                                <PaginationLink href="#" isActive={index === current} onClick={() => { pageUpdate(0, index) }}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}
                    {pages[pages.length - 1] === pageTotal ? (<></>) : (<PaginationItem> <PaginationEllipsis /> </PaginationItem>)}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => { pageUpdate(1, 0) }} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}