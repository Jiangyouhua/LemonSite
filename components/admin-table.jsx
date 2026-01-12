
import { useState } from "react"
import { ChevronDown } from "lucide-react"
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
import { Pen, Plus } from "lucide-react"
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

export default function AdminTable({total, items, dict, loadData, showDetail, addItem }) {
    const [loaded, setLoaded] = useState(false)
    const [page, setPage] = useState(0) // 当前页
    const [limit, setLimit] = useState(10)  // 各页数
    const [pageTags, setPageTags] = useState([]) // 可操作页面
    const [pageTotal, setPageTotal] = useState(0) // 页面总数
    const [columns, setColumns] = useState(Object.keys(dict).map((key) => { return { name: key, checked: true } }))   // 表头列名
    const [text, setText] = useState("") // 过滤字

    const inputChange = function (event) {
        setText(event.target.value)
    }

    const selectChange = function (name) {
        columns.forEach((item, index) => {
            if (item.name === name) {
                columns[index].checked = !item.checked
            }
        })
        setColumns([...columns])
    }

    const limitChange = function (value) {
        const _limie = +value
        setLimit(_limie)
        pageTagsFormat(page, _limie, total)
        loadData(page, limit, back)
    }

    const pageChange = function (action, number) {
        let p = action == 0 ? number : page + action
        const _page = Math.max(0, Math.min(p, pageTotal))
        pageTagsFormat(_page, limit, total)
        if (_page !== page) {
            setPage(_page)
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

    if (!loaded) {
        setLoaded(true)
        loadData(page, limit, back)
    }

    return (
        <div>
            <div className="flex items-center py-4">
                <Button onClick={addItem} size="icon" variant="outline" className="mr-4"><Plus /></Button>
                <ContentInputer inputChange={inputChange} />
                <ColumnSelecter columns={columns} selectChange={selectChange} />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <HeadTabler columns={columns} dict={dict} />
                    <BodyTabler text={text} rows={items} columns={columns} dict={dict} showDetail={showDetail} />
                </Table>
            </div>
            <div className="flex items-center py-4">
                <LimitSelecter limit={limit} limitChange={limitChange} />
                <div className="flex w-full"></div>
                <PaginationTabler current={page} pages={pageTags} pageTotal={pageTotal} pageChange={pageChange} />
            </div>
        </div >
    )
}

export function ContentInputer({ text, inputChange }) {
    return (
        <Input placeholder="Filter content ..." value={text} onChange={inputChange} className="max-w-sm" />
    )
}

export function ColumnSelecter({ columns, selectChange }) {
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
                            checked={item.checked} onCheckedChange={() => selectChange(item.name)}
                        >
                            {item.name}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function HeadTabler({ columns, dict }) {
    return (
        <TableHeader>
            <TableRow>
                <TableHead key='head_index' className="text-center">序号</TableHead>
                {columns.map((column) => (
                    <TableHead key={"head_" + column.name} className={column.checked ? 'visible' : 'hidden'} >
                        {dict[column.name].name ?? column.name}
                    </TableHead>
                ))}
                <TableHead key='head_edit' className="text-center">编辑</TableHead>
            </TableRow>
        </TableHeader>
    )
}

export function BodyTabler({ text, rows, columns, dict, showDetail }) {
    return (
        <TableBody>
            {rows.filter((row) => {
                if (text.length === 0) {
                    return true
                } else {
                    for (const key in columns) {
                        let value = row[key.name]
                        if (typeof value !== 'string') {
                            value = value.toString()
                        }
                        if (value.includes(text)) {
                            return true
                        }
                    }
                    return false
                }
            }).map((row, index) => (
                <TableRow key={"row_" + index}>
                    <TableCell key={"row_index_" + index} className="text-center"> {index} </TableCell>
                    {columns.map((column) => (
                        <TableCell key={'row_' + column.name + "_" + index} className={column.checked ? 'visible' : 'hidden'}>
                            {dict[column.name].cell(row[column.name])}
                        </TableCell>
                    ))}
                    <TableCell key={"row_edit_" + index} className="items-center content-center text-center">
                        <Button variant="outline" onClick={() => { showDetail(row) }}>
                            <Pen />
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

export function LimitSelecter({ limit, limitChange }) {
    return (
        <div className="hidden items-center gap-4 lg:flex w-126">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                每页行数
            </Label>
            <Select value={limit + ''} onValueChange={(_value) => { limitChange(_value) }}>
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

export function PaginationTabler({ current, pages, pageTotal, pageChange }) {
    return (
        <div className="text-right">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => { pageChange(-1, 0) }} />
                    </PaginationItem>
                    {pages[0] === 0 ? (<></>) : (<PaginationItem> <PaginationEllipsis /> </PaginationItem>)}
                    {pages.map((index) => {
                        return (
                            <PaginationItem key={'page_' + index}>
                                <PaginationLink href="#" isActive={index === current} onClick={() => { pageChange(0, index) }}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}
                    {pages[pages.length - 1] === pageTotal ? (<></>) : (<PaginationItem> <PaginationEllipsis /> </PaginationItem>)}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => { pageChange(1, 0) }} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}