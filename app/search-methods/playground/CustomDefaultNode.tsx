import { Handle, NodeProps, Position, type Node as ReactFlowNode } from '@xyflow/react';
import { Fragment } from 'react';

export type CustomDefaultNode = ReactFlowNode<
  {
    label: string;
  },
  'default'
>;

export function CustomDefaultNode({
  data: {
    label,
  },
}: NodeProps<CustomDefaultNode>) {

  return(
    <Fragment>
      <Handle type="source" position={Position.Top} />
      <div>
        {label}
      </div>
      <Handle type="target" position={Position.Bottom} />
    </Fragment>
  );
}