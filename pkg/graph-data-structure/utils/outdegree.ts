import { Graph } from '../Graph';
import { NoInfer } from '../types';

export function outdegree<Node>(graph: Graph<Node>, node: NoInfer<Node>): number {
  return graph.edges.get(node)?.size ?? 0;
}
