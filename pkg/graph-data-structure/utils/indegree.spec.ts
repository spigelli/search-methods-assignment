import { describe, expect, it } from 'vitest';
import { Graph } from '../Graph';
import { indegree } from './indegree';

describe('indegree', () => {
  it('Should compute indegree.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    expect(indegree(graph, 'a')).toEqual(0);
    expect(indegree(graph, 'b')).toEqual(1);

    graph.addEdge('c', 'b');
    expect(indegree(graph, 'b')).toEqual(2);
  });
});
