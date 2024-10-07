import { Graph } from '../../Graph';
import { NoInfer } from '../../types';
import { dijkstra } from './dijkstra';
import { getPath } from './getPath';
import { TraversingTracks } from './types';

/**
 * Dijkstra's Shortest Path Algorithm.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
 * Variable and function names correspond to names in the book.
 */
export function shortestPath<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
): {
  nodes: [Node, Node, ...Node[]];
  weight: number;
} {
  const tracks: TraversingTracks<Node> = {
    d: new Map(),
    p: new Map(),
    q: new Set(),
  };

  dijkstra(graph, tracks, source, destination);

  return getPath(graph, tracks, source, destination);
}
