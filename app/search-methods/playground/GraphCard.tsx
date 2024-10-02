// import { cn } from '@/lib/utils';
import { GraphData } from './actions';
import { Background, Controls, ReactFlow, type Node as ReactFlowNode } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import './style-overrides.css';

const scaleFactor = 1000;

export function GraphCard({
  graphData
}: {
  graphData: GraphData | null;
}) {
  const [nodes, setNodes] = useState<ReactFlowNode[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (graphData === null) {
      return;
    }

    const newNodes = graphData.coordinates.map((coordinate) => ({
      id: coordinate.name,
      position: {
        x: coordinate.latitude * scaleFactor,
        y: coordinate.longitude * scaleFactor,
      },
      data: { label: coordinate.name.replace('_', ' ') },
    }));
    setNodes(newNodes);
  }, [graphData]);

  return (
    <div className="relative mt-4 flex h-[80vh] flex-1 flex-col rounded-xl bg-muted/50 p-4 md:mt-0">
      <div className="mb-2 text-lg font-semibold">Search Results</div>
      <div className="flex-1 overflow-hidden rounded-md border bg-background">
        {graphData === null ? (
          <p className="text-muted-foreground">Run a search to see the results...</p>
        ) : (
          <div className="h-full">
            <ReactFlow
              nodes={nodes}
              style={{ height: '100%' }}
              colorMode={theme === 'dark' ? 'dark' : 'light'}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  );
}