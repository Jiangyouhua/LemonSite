import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export default function MoreMenu({item, actions}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <span className="h-4 w-4 p-4">
        <MoreHorizontal  />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {
            actions.map((action, index)=>{
              return (<DropdownMenuItem key={"action"+index} onClick={()=> action.func(item)}>{action.name}</DropdownMenuItem>)
            })
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}