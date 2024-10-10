import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { search } from './actions';
import { MarkerType, useReactFlow } from '@xyflow/react';
import { searchMethodNames, searchMethodIds, SearchMethodId, flowNodesToGraphNodes, flowEdgesToGraphEdges } from './util';
import { useCallback } from 'react';
import { useSearch } from './SearchProvider';
import { CustomDefaultNode } from './CustomDefaultNode';
import { z } from 'zod';
import { useToast } from '@/components/hooks/use-toast';

const towns = [
  'Abilene',
  'Andover',
  'Anthony',
  'Argonia',
  'Attica',
  'Augusta',
  'Bluff_City',
  'Caldwell',
  'Cheney',
  'Clearwater',
  'Coldwater',
  'Derby',
  'El_Dorado',
  'Emporia',
  'Florence',
  'Greensburg',
  'Harper',
  'Haven',
  'Hays',
  'Hillsboro',
  'Hutchinson',
  'Junction_City',
  'Kingman',
  'Kiowa',
  'Leon',
  'Lyons',
  'Manhattan',
  'Marion',
  'Mayfield',
  'McPherson',
  'Medicine_Lodge',
  'Mulvane',
  'Newton',
  'Oxford',
  'Pratt',
  'Rago',
  'Salina',
  'Sawyer',
  'South_Haven',
  'Topeka',
  'Towanda',
  'Viola',
  'Wellington',
  'Wichita',
  'Winfield',
  'Zenda',
]

const searchMethodSelects = searchMethodIds.map((key) => (
  <SelectItem key={key} value={key}>
    {searchMethodNames[key]}
  </SelectItem>
))

const townSelectsStart = towns.map((town) => (
  <SelectItem key={`${town}-start`} value={town}>
    {town.replace('_', ' ')}
  </SelectItem>
));

const townSelectsEnd = towns.map((town) => (
  <SelectItem key={`${town}-start`} value={town}>
    {town.replace('_', ' ')}
  </SelectItem>
));

const searchFormSchema = z.object({
  algorithm: z.string(),
  startTown: z.string(),
  endTown: z.string(),
});

export function SearchForm({
  hasPopulated,
}: {
  hasPopulated: boolean;
}) {
  const { toast } = useToast()

  const { getNodes, getEdges, setEdges } = useReactFlow<CustomDefaultNode>()

  const {
    searchMethod,
    setSearchMethod,
    startTown,
    updateEndTown,
    endTown,
    updateStartTown,
  } = useSearch()

  const handleSearchMethodChange = useCallback(
    (val: string) => setSearchMethod(val as SearchMethodId),
    [setSearchMethod],
  );

  return (
    <form className="grid w-full items-start gap-2" action={async (formData: FormData) => {
      const {
        algorithm,
        startTown,
        endTown,
      } = searchFormSchema.parse(Object.fromEntries(formData))

      const flowNodes = getNodes()
      const flowEdges = getEdges()
      const nodes = flowNodesToGraphNodes(flowNodes)
      const edges = flowEdgesToGraphEdges(flowEdges)

      const {
        path,
        timeTakenMs,
        isError,
      } = await search(algorithm as SearchMethodId, startTown, endTown, nodes, edges)

      const newEdges = path.map(({ source, target }, index) => ({
        id: `search-edge-${index}`,
        source,
        target,
        label: `Traversal ${index + 1}`,
        type: 'floating',
        data: {
          offsetLabelY: -23,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#ff0072',
        },
        style: {
          strokeWidth: 2,
          stroke: '#FF0072',
        },
        zIndex: 1,
      }))
      setEdges((prevEdges) => {
        const nonSearchEdges = prevEdges.filter((edge) => !edge.id.startsWith('search-edge-'))
        return [...nonSearchEdges, ...newEdges]
      });
      console.log('isError', isError)
      isError ? (
        toast({
        title: `Error running ${searchMethodNames[algorithm as SearchMethodId]} algorithm`,
        description: `Could not find a path between ${startTown} and ${endTown}.`,
        })
      ) : (
        toast({
          title: `Successfully ran ${searchMethodNames[algorithm as SearchMethodId]} algorithm`,
          description: `Searching took ${timeTakenMs.toFixed(4)}ms.`,
        })
      )
    }}>
      <fieldset
        className="grid gap-6 rounded-lg border p-4"
        disabled={!hasPopulated}
      >
        <legend className="-ml-1 px-1 text-sm font-medium">
          Search Algorithm Settings
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="algorithm">Routing Algorithm</Label>
          <Select
            value={searchMethod}
            onValueChange={handleSearchMethodChange}
            name="algorithm"
          >
            <SelectTrigger id="algorithm">
              <SelectValue placeholder="Select an algorithm" />
            </SelectTrigger>
            <SelectContent>
              {searchMethodSelects}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="startTown">Starting Town</Label>
            <Select
              value={startTown}
              onValueChange={updateStartTown}
              name="startTown"
            >
              <SelectTrigger id="startTown">
                <SelectValue placeholder="Select start" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {townSelectsStart}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="endTown">Ending Town</Label>
            <Select
              value={endTown}
              onValueChange={updateEndTown}
              name="endTown"
            >
              <SelectTrigger id="endTown">
                <SelectValue placeholder="Select end" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {townSelectsEnd}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>
      <Button
        type="submit"
        className="w-full"
        disabled={!hasPopulated}
      >
        Run Search Algorithm
      </Button>
    </form>
  )
}
