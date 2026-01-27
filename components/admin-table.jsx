import { useState } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import MoreMenu from "./more-menu"

export default function AdminTable({ total, items, dict, loadData, addItem, actions}) {
    const [key, setKey] = useState("")
    const [value, setValue] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [page, setPage] = useState(0) // 当前页
    const [limit, setLimit] = useState(10)  // 各页数
    const [pageTags, setPageTags] = useState([]) // 可操作页面
    const [pageTotal, setPageTotal] = useState(0) // 页面总数
    const [columns, setColumns] = useState(Object.keys(dict).map((key) => { return { name: key, checked: dict[key].show } }).filter((v) => v.checked))   // 表头列名

    const selectUpdate = function (name) {
        columns.forEach((item, index) => {
            if (item.name === name) {
                columns[index].checked = !item.checked
            }
        })
        setColumns([...columns])
    }

    const search = function () {
        loadData(page, limit, key, value, back)
    }

    const limitUpdate = function (value) {
        const _limie = +value
        setLimit(_limie)
        pageTagsFormat(page, _limie, total)
        loadData(page, limit, key, value, back)
    }

    const pageUpdate = function (action, number) {
        let p = action == 0 ? number : page + action
        const _page = Math.max(0, Math.min(p, pageTotal))
        pageTagsFormat(_page, limit, total)
        if (_page !== page) {
            setPage(_page)
            loadData(_page, limit, key, value, back)
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

    if (!loaded) {
        setLoaded(true)
        loadData(page, limit, key, value, back)
    }

    return (
        <div>
            <div className="flex items-center py-4">
                {!addItem ? <></> : <Button onClick={addItem} size="icon" variant="outline" className="mr-4"><Plus /></Button>}
                <SeachSelecter columns={columns} dict={dict} keyUpdate={setKey} /> &nbsp;&nbsp;
                <Input placeholder="请输入查看的内容..." value={value} onChange={(e) => { setValue(e.target.value) }} className="max-w-sm" />
                &nbsp;&nbsp;<Button onClick={search}>搜索</Button>
                <div className="flex w-full"></div>
                <ColumnSelecter columns={columns} selectUpdate={selectUpdate} />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <HeadTabler columns={columns} dict={dict} />
                    <BodyTabler rows={items} columns={columns} dict={dict} actions={actions} />
                </Table>
            </div>
            <div className="flex items-center py-4">
                <LimitSelecter limit={limit} limitUpdate={limitUpdate} />
                <div className="flex w-full"></div>
                <PaginationTabler className="max-w-sm"  current={page} pages={pageTags} pageTotal={pageTotal} pageUpdate={pageUpdate} />
            </div>
        </div >
    )
}

export function SeachSelecter({ columns, dict, keyUpdate }) {
    return (
        <Select onValueChange={(_value) => { keyUpdate(_value) }}>
            <SelectTrigger id="rows-per-page" className="w-40" >
                <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent side="top">
                {columns.map((column) => (
                    <SelectItem key={"search_key_" + column.name} value={column.name}>
                        {dict[column.name].name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export function HeadTabler({ columns, dict }) {
    return (
        <TableHeader>
            <TableRow>
                <TableHead key='head_index' className="text-center">序号</TableHead>
                {columns.map((column) => (
                    <TableHead key={"head_" + column.name} className={column.checked ? 'visible' : 'hidden'} >
                        {dict[column.name]?.name ?? column.name}
                    </TableHead>
                ))}
                <TableHead key='head_edit' className="text-center">更多</TableHead>
            </TableRow>
        </TableHeader>
    )
}

export function BodyTabler({ rows, columns, dict, actions }) {
    return (
        <TableBody>
            {rows.map((row, index) => (
                <TableRow key={"row_" + index}>
                    <TableCell key={"row_index_" + index} className="text-center"> {index} </TableCell>
                    {columns.map((column) => (
                        <TableCell key={'row_' + column.name + "_" + index} className={(column.checked ? 'visible' : 'hidden') + " max-w-24 overflow-ellipsis overflow-hidden whitespace-nowrap"}>
                            {dict[column.name].cell ? dict[column.name].cell(row[column.name]) : row[column.name]}
                        </TableCell>
                    ))}
                    <TableCell key={"row_edit_" + index} className="items-center content-center text-center">
                        <MoreMenu item={row} actions={actions} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>    
    )
}

export function LimitSelecter({ limit, limitUpdate }) {
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

export function ColumnSelecter({ columns, selectUpdate }) {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    选择显示列 <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {columns.map((item) => {
                    return (
                        <DropdownMenuCheckboxItem key={"column_" + item.name} className="capitalize"
                            checked={item.checked} onCheckedChange={() => selectUpdate(item.name)}
                        >
                            {item.name}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function PaginationTabler({ current, pages, pageTotal, pageUpdate }) {
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