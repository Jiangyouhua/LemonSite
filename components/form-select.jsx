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
import { Pen, Lock } from "lucide-react"
import { Input } from "./ui/input"

export default function FormSelect({ name, column, value, tags }) {
    const [disabled, setDisabled] = useState(true)
    const [option, setOption] = useState(value)
    const selectChange = function(_value) {
        const i = tags.indexOf(_value)
        if (i >= 0) {
            setOption(i)
        }
    }
    return (
        <div className="grid gap-0 py-2">
            <Label htmlFor={column}>
                <Button variant="ghost" size="icon" onClick={(event) => { event.preventDefault(); setDisabled(!disabled) }}  >
                    {disabled ? <Lock /> : <Pen />}
                </Button>
                {name}:
                <Input type="number" size="icon" className='invisible w-16' name={column} value={option} onChange={()=>{}} />    
            </Label>
            <Select disabled={disabled} onValueChange={(_value)=>{selectChange(_value)}} >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={tags[value]} />
                </SelectTrigger>
                <SelectContent>
                    {tags.map((tag, index) => {
                        return (<SelectItem key={column + "_" + index} value={tag}>{tag}</SelectItem>)
                    })}
                </SelectContent>
            </Select>
        </div>
    )
}