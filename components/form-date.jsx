import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Pen, Lock, PencilLine } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup } from "@/components/ui/field"   
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export default function FormDate({ name, column, value, block }) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(value)
    const [disabled, setDisabled] = useState(true)

    const handleOpenChange = (isOpen) => {
        if (block) {
            return
        }
        if (disabled) {
            return
        }
        setOpen(isOpen);
    }

    const handleDateChange = (_date) => {
        setDate(_date.toISOString())
        setOpen(false)
    }

    return (
        <div className="grid gap-0 py-2">
            <Label>
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); setDisabled(!block ? !disabled : true)}}  >
                    {disabled ? (!block ? <Pen /> : <Lock />) : <PencilLine />}
                </Button>
                {name}:
                <input type="hidden" name={column} value={date} />
            </Label>
            <Field disabled={disabled}>
                <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker-optional"
                            className="w-32 justify-between font-normal"
                            disabled={disabled}
                        >
                            {date ? format(date, "PPP") : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            defaultMonth={date}
                            onSelect={handleDateChange}
                        />
                    </PopoverContent>
                </Popover>
            </Field>
        </div>
    )
}