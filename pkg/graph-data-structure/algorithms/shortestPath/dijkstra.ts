import { Graph } from '../../Graph';
import { NoInfer } from '../../types';
import { extractMin } from './extractMin';
import { relax } from './relax';
import { TraversingTracks } from './types';

export function dijkstra<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  tracks: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
) {
  const nodes = graph.nodes;
  const { q } = tracks;

  initializeSingleSource(nodes, tracks, source, destination);
  initializePriorityQueue(nodes, tracks);

  while (q.size !== 0) {
    const u = extractMin(tracks);

    if (u === null) return;

    graph.adjacent(u)?.forEach((v) => {
      relax(graph, tracks, u, v);
    });
  }
}

function initializeSingleSource<Node>(
  nodes: Set<Node>,
  { d }: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
) {
  nodes.forEach((node) => {
    d.set(node, Infinity);
  });

  if (d.get(source) !== Infinity) {
    throw new Error('Source node is not in the graph');
  }

  if (d.get(destination) !== Infinity) {
    throw new Error('Destination node is not in the graph');
  }

  d.set(source, 0);
}

function initializePriorityQueue<Node>(
  nodes: Set<Node>,
  { q }: TraversingTracks<NoInfer<Node>>,
) {
  nodes.forEach((node) => {
    q.add(node);
  });
}
