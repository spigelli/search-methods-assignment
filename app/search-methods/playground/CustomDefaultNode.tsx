import { Fragment } from 'react'
import {
  Handle,
  NodeProps,
  Position,
  type Node as ReactFlowNode,
} from '@xyflow/react'
import { Badge } from '@/components/ui/badge'

export type CustomDefaultNode = ReactFlowNode<
  {
    label: string,
    isStart: boolean,
    isEnd: boolean,
  },
  'default'
>

export function CustomDefaultNode({
  data: {
    label,
    isStart,
    isEnd,
  },
  width,
  height,
  selected,
}: NodeProps<CustomDefaultNode>) {
  return (
    <Fragment>
      <Handle type="source" position={Position.Top} />
      <div>{label}</div>
      {isStart && (
        <Badge variant="destructive">Start Town</Badge>
      )}
      {isEnd && (
        <Badge variant="destructive">End Town</Badge>
      )}
      <Handle type="target" position={Position.Bottom} />
    </Fragment>
  )
}
