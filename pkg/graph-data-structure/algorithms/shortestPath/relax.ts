import { Graph } from '../../Graph';
import { invariant } from '../../invariant';
import { NoInfer } from '../../types';
import { TraversingTracks } from './types';

export function relax<Node>(
  graph: Graph<Node, any>,
  tracks: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  target: NoInfer<Node>,
) {
  const { d, p } = tracks;

  const edgeWeight = graph.getEdgeWeight(source, target);

  const distanceSource = d.get(source);
  const distanceTarget = d.get(target);

  invariant(distanceSource, 'Missing source distance');
  invariant(distanceTarget, 'Missing target distance');

  if (distanceTarget > distanceSource + edgeWeight) {
    d.set(target, distanceSource + edgeWeight);
    p.set(target, source);
  }
}
