import { useState } from 'react';
import {
    Tags,
    TagsContent,
    TagsEmpty,
    TagsGroup,
    TagsInput,
    TagsItem,
    TagsList,
    TagsTrigger,
    TagsValue,
} from '@/components/ui/tags';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pen, Lock, Shield, CheckIcon, PlusIcon } from "lucide-react"

export default function FormTags({ name, column, value, optionWords, block }) {
    const [disabled, setDisabled] = useState(true)
    const [items, setItems] = useState(value)
    const selectedWords = function(_words) {
        setItems(_words)
    }

    return (
        <div className="grid gap-0 py-2">
            <Label>
                <Button variant="ghost" size="icon" onClick={(event) => { event.preventDefault(); setDisabled(!block ? !disabled : true) }}  >
                    {disabled ? ( !block ? <Lock /> : <Shield />) : <Pen />}
                </Button>
                {name}:
            </Label>
            { !items ? <></> : items.map((item, index) =>{
                return (<Input type='hidden' id={column} name={`${column}.${index}`} disabled={disabled} defaultValue={item} />)
            })}
            
            <TagSelect id={column}  disabled={disabled} optionWords={optionWords}  selectedWords={selectedWords} />
        </div>
    )
}

const TagSelect = ({ disabled, optionWords, selectedWords }) => {
    const  [load, setLoad] = useState(false)
    const [selected, setSelected] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState([]);

    const removeTag = function (_value) {
        if (!selected.includes(_value)) {
            return;
        }
        let _words = selected.filter((v) => v != _value)
        setSelected(_words);
        selectedWords(_words)
    };

    const handleSelect = function (_value) {
        if (selected.includes(_value)) {
            removeTag(_value);
            return;
        }
        let _words  = [...selected, _value]
        setSelected(_words);
        selectedWords(_words)
    };

    const handleCreateTag = function () {
        setTags((prev) => [...prev, newTag]);
        let _words  = [...selected, newTag]
        setSelected(_words);
        selectedWords(_words)
        setNewTag('');
    };

    if (!load) {
        setLoad(true)
        optionWords(function(words){
            setTags(words)
        })
    }

    return (
        <Tags className="w-full">
            <TagsTrigger disabled={disabled} >
                {selected.map((tag) => (
                    <TagsValue key={tag} onRemove={() => removeTag(tag)}>
                        {tags.find((t) => t === tag)}
                    </TagsValue>
                ))}
            </TagsTrigger>
            <TagsContent>
                <TagsInput onValueChange={setNewTag} placeholder="输入搜索..." />
                <TagsList>
                    <TagsEmpty>
                        <button
                            className="mx-auto flex cursor-pointer items-center gap-2"
                            onClick={handleCreateTag}
                            type="button"
                        >
                            <PlusIcon className="text-muted-foreground" size={14} />
                            新添: {newTag}
                        </button>
                    </TagsEmpty>
                    <TagsGroup>
                        {tags.map((tag) => (
                            <TagsItem key={tag} onSelect={handleSelect} value={tag}>
                                {tag}
                                {selected.includes(tag) && (
                                    <CheckIcon className="text-muted-foreground" size={14} />
                                )}
                            </TagsItem>
                        ))}
                    </TagsGroup>
                </TagsList>
            </TagsContent>
        </Tags>
    );
};

