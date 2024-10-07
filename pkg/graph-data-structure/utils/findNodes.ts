import { Graph } from '../Graph';
import { NoInfer } from '../types';

/**
 * Returns all the nodes matching your function.
 */
export function findNodes<Node>(
  graph: Graph<Node, any>,
  fn: (node: NoInfer<Node>) => boolean,
): Node[] {
  const nodes: Node[] = [];

  graph.nodes.forEach((node) => {
    if (fn(node)) {
      nodes.push(node);
    }
  });

  return nodes;
}
