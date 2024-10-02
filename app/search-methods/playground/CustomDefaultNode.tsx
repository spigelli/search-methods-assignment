import { NodeProps, type Node as ReactFlowNode } from '@xyflow/react';

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
    <div>{label}</div>
  );
}