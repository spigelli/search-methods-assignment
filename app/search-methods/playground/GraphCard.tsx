// import { cn } from '@/lib/utils';
import { GraphData } from './actions';
import {
  Background,
  Controls,
  ReactFlow,
  type Node as ReactFlowNode,
  type Edge,
  ReactFlowProps,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
import { Fragment, useCallback, useEffect, useState } from 'react';
import './style-overrides.css';
import { CustomDefaultNode } from './CustomDefaultNode';
import { FloatingEdge } from '@/components/react-flow/FloatingEdge';
import FloatingConnectionLine from '@/components/react-flow/FloatingConnectionLine';

const scaleFactor = 1000;

function getCartesianDistance(
  coordinates: GraphData['coordinates'],
  source: string,
  target: string
) {
  const sourceCoordinate = coordinates.find(
    (coordinate) => coordinate.name === source
  );
  const targetCoordinate = coordinates.find(
    (coordinate) => coordinate.name === target
  );

  if (sourceCoordinate === undefined || targetCoordinate === undefined) {
    return 0;
  }

  return Math.sqrt(
    Math.pow(sourceCoordinate.latitude - targetCoordinate.latitude, 2) +
      Math.pow(sourceCoordinate.longitude - targetCoordinate.longitude, 2)
  );
}

const edgeTypes = {
  'floating': FloatingEdge,
};

export function GraphCard({
  graphData
}: {
  graphData: GraphData | null;
}) {
  const { theme } = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          },
          eds,
        ),
      ),
    [setEdges],
  );


  useEffect(() => {
    if (graphData === null) {
      return;
    }

    const newNodes = graphData.coordinates.map((coordinate) => ({
      id: coordinate.name,
      position: {
        x: coordinate.longitude * scaleFactor,
        y: -1 * coordinate.latitude * scaleFactor,
      },
      data: { label: coordinate.name.replace('_', ' ') },
      type: 'default',
    }));
    setNodes(newNodes);

    const newEdges = graphData.adjacencies.map(([source, target], index) => ({
      id: `edge-${source}-${target}-${index}`,
      source,
      target,
      type: 'floating',
      label: `${getCartesianDistance(graphData.coordinates, source, target).toFixed(2)} km`,
    }));

    setEdges(newEdges);
  }, [graphData]);

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
      connectionLineComponent={FloatingConnectionLine}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
