import { useCallback, useEffect } from 'react'
import {
  Background,
  Connection,
  Controls,
  MarkerType,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node as ReactFlowNode,
} from '@xyflow/react'
import { useTheme } from 'next-themes'

import { GraphData } from './actions'
import './style-overrides.css'
import FloatingConnectionLine from '@/components/react-flow/FloatingConnectionLine'
import { FloatingEdge } from '@/components/react-flow/FloatingEdge'

import { CustomDefaultNode } from './CustomDefaultNode'

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

const nodeTypes = { default: CustomDefaultNode }

const edgeTypes = {
  floating: FloatingEdge,
}

export function GraphCard() {
  const { theme } = useTheme()

  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          },
          eds
        )
      ),
    [setEdges]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      style={{ height: '100%' }}
      colorMode={theme === 'dark' ? 'dark' : 'light'}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      // @ts-ignore
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      connectionLineComponent={FloatingConnectionLine}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  )
}
