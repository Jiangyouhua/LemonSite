import { useState } from "react";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Pen, Lock, Shield } from "lucide-react"

export default function FormInput({ name, column, value, block }) {
    const _type = typeof value === 'number' ? "number" : "text"
    const [disabled, setDisabled] = useState(true)
    return (
        <div className="grid gap-0 py-2">
            <Label>
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); setDisabled(!block ? !disabled : true)}}  >
                    {disabled ? ( !block ? <Lock /> : <Shield />) : <Pen />}
                </Button>
                {name}:
            </Label>
            <Input type={_type} id={column} name={column} disabled={disabled} defaultValue={value} placeholder={value} />
        </div>
    )
}