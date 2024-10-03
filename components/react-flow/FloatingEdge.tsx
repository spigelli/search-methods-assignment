import { getBezierPath, Edge, useInternalNode, EdgeLabelRenderer, BaseEdge, EdgeProps } from '@xyflow/react';

import { getEdgeParams } from './utils';
import { CustomDefaultNode } from '@/app/search-methods/playground/CustomDefaultNode';

export type FloatingEdge = Edge<
  {
    weight: number;
  },
  'floating'
>

export function FloatingEdge({
  source,
  target,
  ...baseEdgeProps
}: EdgeProps<FloatingEdge>) {
  const sourceNode = useInternalNode<CustomDefaultNode>(source);
  const targetNode = useInternalNode<CustomDefaultNode>(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <BaseEdge
      {...baseEdgeProps}
      path={edgePath}
      labelX={labelX}
      labelY={labelY}
    />
  );
}
