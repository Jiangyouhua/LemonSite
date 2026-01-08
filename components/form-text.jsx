import { Input } from "./ui/input"

export default function FormText({name, column, value}) {
    const _type = typeof value  === 'number' ? "number" : "text"
    return (
        <h1 className="text-gray">
            {name}: {value}
            <Input type={_type} className="invisible" name={column} defaultValue={value} />
        </h1>
    )
}