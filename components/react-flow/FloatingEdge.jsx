import { getBezierPath, EdgeText, useInternalNode, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';

import { getEdgeParams } from './utils.js';

export function FloatingEdge({
  source,
  target,
  ...baseEdgeProps
}) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

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
