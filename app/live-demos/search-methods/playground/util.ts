import { Edge, Node } from "@xyflow/react";



import { GraphData } from "./actions";

export function getHaversineDistance(
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
    throw new Error('Source or target coordinate not found')
  }

  const latitudinalDisplacement = targetCoordinate.latitude - sourceCoordinate.latitude
  const longitudinalDisplacement = targetCoordinate.longitude - sourceCoordinate.longitude

  const latitudinalDisplacementRadians = latitudinalDisplacement * Math.PI / 180
  const longitudinalDisplacementRadians = longitudinalDisplacement * Math.PI / 180

  const a = Math.pow(Math.sin(latitudinalDisplacementRadians / 2), 2) +
    Math.pow(Math.sin(longitudinalDisplacementRadians / 2), 2) *
    Math.cos(sourceCoordinate.latitude * Math.PI / 180) *
    Math.cos(targetCoordinate.latitude * Math.PI / 180)

  const earthRadius = 6371

  const c = 2 * Math.asin(Math.sqrt(a))

  return earthRadius * c
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