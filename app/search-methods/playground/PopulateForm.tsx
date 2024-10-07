import Link from 'next/link'
import { useReactFlow } from '@xyflow/react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'

import { getGraphData } from './actions'
import { getCartesianDistance } from './util';
import { CustomDefaultNode } from './CustomDefaultNode';
import { FloatingEdge } from '@/components/react-flow/FloatingEdge';

const scaleFactor = 1000

export function PopulateForm() {
  const { setNodes, setEdges } = useReactFlow<CustomDefaultNode, FloatingEdge>()
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
          data: {
            label: coordinate.name.replace('_', ' '),
            isStart: false,
            isEnd: false,
          },
          type: 'default' as const,
        }))
        const newEdges = graphData.adjacencies.map(
          ([source, target], index) => {
            const cartesianDistance = getCartesianDistance(
              graphData.coordinates,
              source,
              target
            );

            return {
              id: `edge-${source}-${target}`,
              source,
              target,
              type: 'floating' as const,
              label: `${cartesianDistance.toFixed(2)} km`,
              data: {
                weight: cartesianDistance,
              },
              zIndex: 10,
            };
          }
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
