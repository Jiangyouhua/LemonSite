import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pen, Lock, PencilLine } from "lucide-react"
import { Input } from "./ui/input"

// options = [{ID: int, Name: string}]
export default function FormSelect({ name, column, value, options, block }) {
    const placeholder = !value || options.length == 0 ? "请选择" : options.find((_option) => _option.Value == value).Name || "请选择"
    const [disabled, setDisabled] = useState(true)
    const [option, setOption] = useState(value)

    const selectUpdate = (_value) => {
        setOption(options.find((_option) => _option.Name == _value).Value)
    }
    
    return (
        <div className="grid gap-0 py-2">
            <Label>
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); setDisabled(!block ? !disabled : true) }}  >
                    {disabled ? (!block ? <Pen /> : <Lock />) : <PencilLine />}
                </Button>
                {name}:
                <Input type="number" size="icon" disabled={disabled} className='invisible w-16' name={column} value={option} />
            </Label>
            <Select disabled={disabled} onValueChange={(_value) => { selectUpdate(_value) }} >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((_option) => {
                        return (<SelectItem key={column + "_" + _option.Value} value={_option.Name}>{_option.Name}</SelectItem>)
                    })}
                </SelectContent>
            </Select>
        </div>
    )
}