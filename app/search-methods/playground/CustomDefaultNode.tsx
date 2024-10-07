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
      <Handle
        type="source"
        position={Position.Right}
      />
      <div className="relative">
        {label}
      </div>
      <div className="h-0 overflow-visible">
        {isStart && (
          <Badge variant="success" className="mt-1">Start Town</Badge>
        )}
        {isEnd && (
          <Badge variant="info" className="mt-1">Start Town</Badge>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Left}
      />
    </Fragment>
  )
}
