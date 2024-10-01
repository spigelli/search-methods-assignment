
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const towns = [
  "Abilene", "Andover", "Anthony", "Argonia", "Attica", "Augusta", "Bluff_City", "Caldwell", 
  "Cheney", "Clearwater", "Coldwater", "Derby", "El_Dorado", "Emporia", "Florence", "Greensburg", 
  "Harper", "Haven", "Hays", "Hillsboro", "Hutchinson", "Junction_City", "Kingman", "Kiowa", 
  "Leon", "Lyons", "Manhattan", "Marion", "Mayfield", "McPherson", "Medicine_Lodge", "Mulvane", 
  "Newton", "Oxford", "Pratt", "Rago", "Salina", "Sawyer", "South_Haven", "Topeka", "Towanda", 
  "Viola", "Wellington", "Wichita", "Winfield", "Zenda"
]

export default function SearchMethodsPlaygroundPage() {
  return (
    <div className="flex min-h-screen w-full flex-col p-4 md:flex-row md:gap-4">
      <div className="w-full md:w-1/3">
        <form className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Search Algorithm Settings
            </legend>
            <div className="grid gap-3">
              <Label htmlFor="algorithm">Routing Algorithm</Label>
              <Select>
                <SelectTrigger id="algorithm">
                  <SelectValue placeholder="Select an algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bfs">Breadth-First</SelectItem>
                  <SelectItem value="dfs">Depth-First</SelectItem>
                  <SelectItem value="iddfs">ID-DFS</SelectItem>
                  <SelectItem value="bestfs">Best-First</SelectItem>
                  <SelectItem value="astar">A*</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="start-town">Starting Town</Label>
                <Select>
                  <SelectTrigger id="start-town">
                    <SelectValue placeholder="Select start" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {towns.map((town) => (
                        <SelectItem key={town} value={town.toLowerCase()}>
                          {town.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="end-town">Ending Town</Label>
                <Select>
                  <SelectTrigger id="end-town">
                    <SelectValue placeholder="Select end" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {towns.map((town) => (
                        <SelectItem key={town} value={town.toLowerCase()}>
                          {town.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>
          <Button type="submit" className="w-full">
            Run Search Algorithm
          </Button>
        </form>
      </div>
      <div className="relative mt-4 flex h-full min-h-[50vh] flex-1 flex-col rounded-xl bg-muted/50 p-4 md:mt-0">
        <div className="mb-2 text-lg font-semibold">Search Results</div>
        <div className="flex-1 overflow-auto rounded-md border bg-background p-4">
          <p className="text-muted-foreground">Run a search to see the results...</p>
        </div>
      </div>
    </div>
  );
}