import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node as ReactFlowNode,
} from '@xyflow/react'
import { useTheme } from 'next-themes'

import './style-overrides.css'
import FloatingConnectionLine from '@/components/react-flow/FloatingConnectionLine'
import { FloatingEdge } from '@/components/react-flow/FloatingEdge'

import { CustomDefaultNode } from './CustomDefaultNode'

const nodeTypes = { default: CustomDefaultNode }

const edgeTypes = {
  floating: FloatingEdge,
}

const initialNodes: ReactFlowNode[] = []
const initialEdges: Edge[] = []

export function GraphCard() {
  const { theme } = useTheme()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
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
      connectionLineComponent={FloatingConnectionLine}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  )
}
