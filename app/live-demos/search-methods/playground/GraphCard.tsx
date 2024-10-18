import {
  Background,
  BezierEdge,
  ReactFlow,
  SmoothStepEdge,
  StraightEdge,
  useEdgesState,
  useNodesState,
  type Edge,
} from '@xyflow/react'
import { useTheme } from 'next-themes'

import './style-overrides.css'
import { FloatingEdge } from '@/components/react-flow/FloatingEdge'

import { CustomDefaultNode } from './CustomDefaultNode'

const nodeTypes = { default: CustomDefaultNode }

const edgeTypes = {
  floating: FloatingEdge,
  smoothstep: SmoothStepEdge,
  bezier: BezierEdge,
  straight: StraightEdge,
}

const initialNodes: CustomDefaultNode[] = []
const initialEdges: Edge[] = []

export function GraphCard() {
  const { theme } = useTheme()

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomDefaultNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      style={{ height: '100%' }}
      colorMode={theme === 'dark' ? 'dark' : 'light'}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
    </ReactFlow>
  )
}
