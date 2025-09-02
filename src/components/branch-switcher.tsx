
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppContext } from "@/context/AppContext"
import { MapPin } from "lucide-react"

export function BranchSwitcher() {
  const { branches, selectedBranch, setSelectedBranch } = useAppContext();

  if (branches.length <= 1) {
    return (
        <div className="flex items-center gap-2 h-10 px-3 w-full rounded-lg border border-input bg-background text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate font-medium">{branches[0]?.name ?? "No Branch"}</span>
        </div>
    );
  }


  return (
    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
      <SelectTrigger className="w-full sm:w-[220px] h-10 gap-2 px-3 rounded-lg font-medium">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="truncate">
            <SelectValue placeholder="Select a branch" />
        </span>
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
