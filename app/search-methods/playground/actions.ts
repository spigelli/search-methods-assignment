'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { z } from 'zod'
import { Graph } from '@/pkg/graph-data-structure'
import { SearchMethodId } from './util';

async function parseCoordinates() {
  // Construct the full path to the CSV file in the public folder
  const filePath = path.join(process.cwd(), 'public', 'coordinates.csv')
  try {
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf-8')

    // Parse the CSV content
    const records = parse(fileContent, {
      columns: ['name', 'latitude', 'longitude'], // Treat the first row as header
      onRecord: (record) => {
        record.latitude = parseFloat(record.latitude)
        record.longitude = parseFloat(record.longitude)
        return record
      },
      skip_empty_lines: true,
    })

    const recordsSchema = z.array(
      z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    return recordsSchema.parse(records)
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error)
    throw new Error('Failed to read or parse CSV file')
  }
}

const adjacencySchema = z.array(z.tuple([z.string(), z.string()]))

const parseAdjacencies = async () => {
  const filePath = path.join(process.cwd(), 'public', 'Adjacencies.txt')
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const lines = fileContent.split('\n')
    // Some of the lines contain trailing whitespace, so we trim them
    const trimmedLines = lines.map((line) => line.trim())
    const formattedAdjacencies = adjacencySchema.parse(
      trimmedLines.map((line) => line.split(' '))
    )
    // Deduplicate the edges if the reverse edge is also present
    return formattedAdjacencies.filter(
      ([source, target], index, self) =>
        self.findIndex(([s, t]) => s === target && t === source) === -1
    )
  } catch (error) {
    console.error('Error reading or parsing adjacency file:', error)
    throw new Error('Failed to read or parse adjacency file')
  }
}

export async function getGraphData() {
  const coordinates = await parseCoordinates()
  const adjacencies = await parseAdjacencies()
  return { coordinates, adjacencies }
}
export type GraphData = Awaited<ReturnType<typeof getGraphData>>

/**
 * Use depth-first search to find a path between two towns avoiding cycles.
 */
function searchDFS(
  graph: Graph,
  startTown: string,
  endTown: string,
) {
  const visited = new Set<string>()
  const stack = [startTown]

  while (stack.length > 0 && !visited.has(endTown)) {
    // Pop the last element from the stack
    const currentTown = stack.pop() as string
    // Mark the current town as visited
    visited.add(currentTown)
    // Add the adjacent towns to the stack
    const adjacentTownsSet = graph.adjacent(currentTown)
    if (adjacentTownsSet !== undefined) {
      const adjacentTowns = Array.from(adjacentTownsSet)
      // Sort the adjacent towns in ascending weight
      adjacentTowns.sort((a, b) => {
        const weightA = graph.getEdgeWeight(currentTown, a) || 0
        const weightB = graph.getEdgeWeight(currentTown, b) || 0
        return weightA - weightB
      })
      // Add the adjacent towns to the stack if they have not been visited
      adjacentTowns.forEach((town) => {
        if (!visited.has(town)) {
          stack.push(town)
        }
      })
    }
  }

  return Array.from(visited)
}

/**
 * Operates similarly to the `searchDFS` function, but with returns the path as a list of edges.
 */
function searchDFSPath(
  graph: Graph,
  startTown: string,
  endTown: string,
) {
  const visited: {
    source: string;
    target: string;
  }[] = []

  const foundEndTown = () => visited.some((edge) => edge.target === endTown)

  const stack: {
    id: string;
    adjacentFrom: string;
  }[] = [
    { id: startTown, adjacentFrom: startTown },
  ]

  while (stack.length > 0 && !foundEndTown()) {
    // Pop the last element from the stack
    const {
      id: currentTown,
      adjacentFrom,
    } = stack.pop() as { id: string; adjacentFrom: string }

    // Unless the current town is the start town, add the edge to the visited list
    if (currentTown !== startTown) {
      visited.push({ source: adjacentFrom, target: currentTown })
    }

    // Add the adjacent towns to the stack
    const adjacentTownsSet = graph.adjacent(currentTown)
    if (adjacentTownsSet !== undefined) {
      const adjacentTowns = Array.from(adjacentTownsSet)
      // Sort the adjacent towns in ascending weight

      adjacentTowns.sort((a, b) => {
        const weightA = graph.getEdgeWeight(currentTown, a) || 0
        const weightB = graph.getEdgeWeight(currentTown, b) || 0
        return weightB - weightA
      })
      // Add the adjacent towns to the stack if they have not been visited
      adjacentTowns.forEach((town) => {
        if (!visited.some((edge) => edge.target === town)) {
          stack.push({ id: town, adjacentFrom: currentTown })
        }
      })
    }
  }

  return visited
}
export async function search(
  algorithm: SearchMethodId,
  startTown: string,
  endTown: string,
  nodes: string[],
  edges: {
    source: string;
    target: string;
    weight: number;
  }[]
) {


  const graph = new Graph()
  nodes.forEach((node) => graph.addNode(node))
  edges.forEach((edge) => {
    graph.addEdge(edge.source, edge.target, edge.weight);
    graph.addEdge(edge.target, edge.source, edge.weight);
  })

  const path = searchDFSPath(graph, startTown, endTown)
  return path
}