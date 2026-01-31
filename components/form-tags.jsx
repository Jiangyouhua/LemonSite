import { useState } from "react";
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Pen, Lock, Shield } from "lucide-react"
import { toast } from "sonner";


export default function FromTags({ name, value, column, loadOptions, block }) {
    const [loaded, setLoaded] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [word, setWord] = useState("")
    const [tags, setTags] = useState(value ?? [])
    const [options, setOptions] = useState([])

    const inputKeyUp = (event) => {
        if (event.keyCode == 13) {
            let text = event.target.value.trim()
            if (!text || text.length === 0) {
                return
            }
            if (tags.includes(text)) {
                toast.error("该标签已存在")
                return
            }
            setTags((prev) => [...prev, text])
            setWord("")
            event.target.value = ""
            event.target.focus()
        }
    }

    const removeTag = (text) => {
        setTags((prev) => prev.filter((tag) => tag !== text))
    }

    const addTag = (text) => {
        removeTag(text)
        setTags((prev) => [...prev, text])
    }

    if (!loaded) {
        loadOptions((_options) => {
            setLoaded(true)
            setOptions(_options)
        })
    }

    return (
        <div>
            <Label>
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); setDisabled(!block ? !disabled : true) }}  >
                    { disabled ? (!block ? <Lock /> : <Shield />) : <Pen /> }
                </Button>
                {name}:
            </Label>
            {
                (!tags || tags.length === 0) ?
                    <p className="text-center border rounded-md p-1 mb-2"><small>无内容</small></p>
                    :
                    <div className="pb-3 pt-1">
                        {tags.map((text, index) => {
                            return (
                                <span key={"select_tag_" + index} >
                                    <span className="border rounded-md px-3 py-2 text-sm">
                                        {text}
                                        {disabled || block ? <></> :
                                            <>
                                                &nbsp;&nbsp;
                                                <input type="button" className="text-sm" onClick={(e) => { e.preventDefault; removeTag(text) }} value="✕" />
                                            </>
                                        }
                                    </span>
                                    &nbsp;
                                    <input type="hidden" name={`${column}.${index}`} value={text} />
                                </span>
                            )
                        })}
                    </div>
            }
            {   
                disabled || block ? 
                <></> 
                :
                <div className="border rounded-md text-sm">
                    <Input className="border-0 shadow-none input-tag" type="text" onKeyUp={inputKeyUp} placeholder="输入后，回车添加……" onChange={(e) => { e.preventDefault; setWord(e.target.value) }} defaultValue={word} />
                    <div className="mx-2">
                        <Separator />
                        <div className="my-2">
                            {
                                options.filter(w => !tags.includes(w) && (!word || w.includes(word))).map((text, index) => {
                                    return (
                                        <span key={"option_tag_" + index}>
                                            <Input className='w-fit' type="button" value={text} onClick={(e) => { e.preventDefault; addTag(text) }} />
                                            &nbsp;
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}