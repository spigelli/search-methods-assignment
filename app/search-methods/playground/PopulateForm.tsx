import Link from 'next/link'
import { useReactFlow } from '@xyflow/react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'

import { GraphData, getGraphData } from './actions'

const scaleFactor = 1000

function getCartesianDistance(
  coordinates: GraphData['coordinates'],
  source: string,
  target: string
) {
  const sourceCoordinate = coordinates.find(
    (coordinate) => coordinate.name === source
  )
  const targetCoordinate = coordinates.find(
    (coordinate) => coordinate.name === target
  )

  if (sourceCoordinate === undefined || targetCoordinate === undefined) {
    return 0
  }

  return Math.sqrt(
    Math.pow(sourceCoordinate.latitude - targetCoordinate.latitude, 2) +
      Math.pow(sourceCoordinate.longitude - targetCoordinate.longitude, 2)
  )
}

export function PopulateForm() {
  const { setNodes, setEdges } = useReactFlow()
  return (
    <form
      className="grid w-full items-start gap-2"
      action={async () => {
        const graphData = await getGraphData()
        const newNodes = graphData.coordinates.map((coordinate) => ({
          id: coordinate.name,
          position: {
            x: coordinate.longitude * scaleFactor,
            y: -1 * coordinate.latitude * scaleFactor,
          },
          data: { label: coordinate.name.replace('_', ' ') },
          type: 'default',
        }))
        const newEdges = graphData.adjacencies.map(
          ([source, target], index) => ({
            id: `edge-${source}-${target}`,
            source,
            target,
            type: 'floating',
            label: `${getCartesianDistance(
              graphData.coordinates,
              source,
              target
            ).toFixed(2)} km`,
          })
        )
        setNodes(newNodes)
        setEdges(newEdges)
      }}
    >
      <fieldset className="rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Sources</legend>
        <div className="grid grid-cols-2 gap-4">
          <Button className="px-2" variant="secondary" size="default" asChild>
            <Link href="/coordinates.csv" target="_blank">
              Coordinates
              <Icons.download className="ml-1 size-4" />
            </Link>
          </Button>
          <Button className="px-2" variant="secondary" size="default" asChild>
            <Link
              href="/Adjacencies.txt"
              target="_blank"
              className={buttonVariants({
                size: 'default',
                variant: 'link',
              })}
            >
              Adjacencies
              <Icons.newPage className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </fieldset>
      <Button type="submit" className="w-full">
        Populate Tree
      </Button>
    </form>
  )
}
