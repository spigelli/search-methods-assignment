import { CycleError } from '../../CycleError';
import { Graph } from '../../Graph';
import { NoInfer } from '../../types';
import { DepthFirstSearchOptions } from './types';

export function depthFirstVisit<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  nodeList: NoInfer<Node>[],
  visited: Set<NoInfer<Node>>,
  visiting: Set<NoInfer<Node>>,
  node: NoInfer<Node>,
  opts: Pick<DepthFirstSearchOptions<Node, LinkProps>, 'errorOnCycle' | 'shouldFollow'>,
) {
  const { errorOnCycle = false, shouldFollow } = opts;

  if (visiting.has(node) && errorOnCycle) {
    throw new CycleError('Cycle found');
  }

  if (!visited.has(node)) {
    visited.add(node);
    visiting.add(node);

    graph.adjacent(node)?.forEach((n) => {
      const follow =
        shouldFollow === undefined || shouldFollow({ source: node, target: n, graph });
      if (!follow) return;

      depthFirstVisit(graph, nodeList, visited, visiting, n, opts);
    });

    visiting.delete(node);
    nodeList.push(node);
  }
}
