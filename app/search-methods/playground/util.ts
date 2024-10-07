import { Edge, Node } from "@xyflow/react";



import { GraphData } from "./actions";


export function getCartesianDistance(
  coordinates: GraphData['coordinates'],
  source: string,
  target: string
) {
  const sourceCoordinate = coordinates.find(
    (coordinate) => coordinate.name === source
  )
  const targetCoordinate = coordinates.find(
    (coordinate) => coordinate.name === target
  )

  if (sourceCoordinate === undefined || targetCoordinate === undefined) {
    return 0
  }

  return Math.sqrt(
    Math.pow(sourceCoordinate.latitude - targetCoordinate.latitude, 2) +
      Math.pow(sourceCoordinate.longitude - targetCoordinate.longitude, 2)
  )
}

export const searchMethodIds = ['bfs', 'dfs', 'iddfs', 'bestfs', 'astar' ] as const

export type SearchMethodId = typeof searchMethodIds[number]

export const searchMethodNames: Record<SearchMethodId, string> = {
  bfs: 'Breadth-First',
  dfs: 'Depth-First',
  iddfs: 'ID-DFS',
  bestfs: 'Best-First',
  astar: 'A*',
}

export function flowNodesToGraphNodes<T extends Node>(nodes: T[]) {
  return nodes.map((node) => (node.id))
}

export function flowEdgesToGraphEdges<T extends Edge>(edges: T[]) {
  return (
    edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      weight: edge.data?.weight,
    }))
    .filter((edge) => edge.weight !== undefined) as {
      source: string
      target: string
      weight: number
    }[]
  )
}