import { useState } from "react";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Pen, Lock, PencilLine } from "lucide-react"

export default function FormInput({ name, column, value, block, ...props }) {
    const [disabled, setDisabled] = useState(true)
    return (
        <div className="grid gap-0 py-2">
            <Label>
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); setDisabled(!block ? !disabled : true)}}  >
                    {disabled ? (!block ? <Pen /> : <Lock />) : <PencilLine />}
                </Button>
                {name}:
            </Label>
            <Input id={column} name={column} disabled={disabled} defaultValue={value} placeholder={value} {...props} />
        </div>
    )
}