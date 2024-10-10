'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { Graph } from '@/pkg/graph-data-structure';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';



import { SearchMethodId, getCartesianDistance } from './util';


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
async function searchDFS(
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
async function searchDFSPath(
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
  if (!foundEndTown()) {
    return []
  }
  return visited
}

async function searchBFSPath(
  graph: Graph,
  startTown: string,
  endTown: string,
) {
  const visited: {
    source: string;
    target: string;
  }[] = []

  const foundEndTown = () => visited.some((edge) => edge.target === endTown)

  const queue: {
    id: string;
    adjacentFrom: string;
  }[] = [
    { id: startTown, adjacentFrom: startTown },
  ]

  while (queue.length > 0 && !foundEndTown()) {
    // Pop the first element from the queue
    const {
      id: currentTown,
      adjacentFrom,
    } = queue.shift() as { id: string; adjacentFrom: string }

    // Unless the current town is the start town, add the edge to the visited list
    if (currentTown !== startTown) {
      visited.push({ source: adjacentFrom, target: currentTown })
    }

    // Add the adjacent towns to the queue
    const adjacentTownsSet = graph.adjacent(currentTown)
    if (adjacentTownsSet !== undefined) {
      const adjacentTowns = Array.from(adjacentTownsSet)
      // Sort the adjacent towns in ascending weight

      adjacentTowns.sort((a, b) => {
        const weightA = graph.getEdgeWeight(currentTown, a) || 0
        const weightB = graph.getEdgeWeight(currentTown, b) || 0
        return weightA - weightB
      })
      // Add the adjacent towns to the queue if they have not been visited
      adjacentTowns.forEach((town) => {
        if (!visited.some((edge) => edge.target === town)) {
          queue.push({ id: town, adjacentFrom: currentTown })
        }
      })
    }
  }
  if (!foundEndTown()) {
    return []
  }

  return visited
}

/**
 * Performs a depth-limited search to find a path between two towns.
 * Essentially a dfs with a depth limit.
 */
function searchDLSPath(
  graph: Graph,
  startTown: string,
  endTown: string,
  maxDepth: number,
) {
  const visited: {
    source: string;
    target: string;
  }[] = []
  const stack = [
    {id: startTown, adjacentFrom: startTown, depth: 0}
  ]

  while (stack.length > 0 && !visited.some(visited => visited.target === endTown)) {
    // Pop the last element from the stack
    const {
      id: currentTown,
      depth: currentTownDepth,
      adjacentFrom,
    } = stack.pop() as {
      id: string,
      depth: number,
      adjacentFrom: string
    }

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
        if (!visited.some((edge) => edge.target === town) && currentTownDepth < maxDepth) {
          stack.push({ id: town, adjacentFrom: currentTown, depth: currentTownDepth + 1 })
        }
      })
    }
  }
  return {
    endFound: visited.some(visited => visited.target === endTown),
    visited
  }
}

/**
 * Performs an iterative deepening search to find a path between two towns.
 * Essentially a dfs with increasing depth limits.
 * NOTE: For an undirected graph, should IDDFS's calls to DLS include the visited set? cause otherwise this will create cycles.
 */
async function searchIDDFSPath(
  graph: Graph,
  startTown: string,
  endTown: string,
) {
  let found = false
  let currentMaxDepth = 0
  const visited: {
    source: string;
    target: string;
  }[] = []
  while(!found && currentMaxDepth < graph.nodes.size) {
    const { endFound, visited: currentVisited } = searchDLSPath(graph, startTown, endTown, currentMaxDepth)
    visited.push(...currentVisited)
    found = endFound
    currentMaxDepth++
  }
  if (!found) {
    return []
  }
  return visited
}

async function searchHeuristic(
  graph: Graph,
  startTown: string,
  endTown: string,
  heuristic: (coordinates: GraphData['coordinates'], currentTown: string, potentialNextTown: string, endTown: string) => number
) {
  const coordinates = await parseCoordinates()

  // A priority queue to hold nodes, ordered by heuristic cost
  const priorityQueue = [{
    id: startTown,
    adjacentFrom: startTown,
    cost: 0,
  }];
  
  const visited: {
    source: string;
    target: string;
  }[] = []
  
  // Helper function to check if we've reached the goal
  const foundEndTown = () => visited.some((edge) => edge.target === endTown);
  
  while (priorityQueue.length > 0 && !foundEndTown()) {
    // Remove the node with the smallest heuristic value (front of queue)
    priorityQueue.sort((a, b) => a.cost - b.cost);
    const current = priorityQueue.shift();
    if (current === undefined) {
      throw new Error('Priority queue is empty');
    }
    const {
      id: currentTown,
      adjacentFrom,
    } = current
    
    // Add the edge to the visited list (if not the start)
    if (currentTown !== startTown) {
      visited.push({ source: adjacentFrom, target: currentTown });
    }
    
    // Get the adjacent towns and add them to the priority queue if not already visited
    const adjacentTownsSet = graph.adjacent(currentTown);
    if (adjacentTownsSet !== undefined) {
      const adjacentTowns = Array.from(adjacentTownsSet);
      
      adjacentTowns.forEach((town) => {
        if (!visited.some((edge) => edge.target === town)) {
          const cost = heuristic(coordinates, currentTown, town, endTown); // Use heuristic function for cost estimation
          priorityQueue.push({ id: town, adjacentFrom: currentTown, cost });
        }
      });
    }
  }
  if (!foundEndTown()) {
    return [];
  }
  return visited;
}

async function searchBestFirstPath(
  graph: Graph,
  startTown: string,
  endTown: string
) {
  return await searchHeuristic(
    graph,
    startTown,
    endTown,
    (coordinates, currentTown, potentialNextTown, endTown) => (
      getCartesianDistance(coordinates, potentialNextTown, endTown)
    )
  );
}

async function searchAStarPath(
  graph: Graph,
  startTown: string,
  endTown: string
) {
  return await searchHeuristic(
    graph,
    startTown,
    endTown,
    (coordinates, currentTown, potentialNextTown, endTown) => {
      const distanceToGoal = getCartesianDistance(coordinates, potentialNextTown, endTown);
      const distanceFromCurrent = getCartesianDistance(coordinates, currentTown, potentialNextTown);
      return distanceToGoal + distanceFromCurrent;
    }
  );
}

type SearchFunction = (
  graph: Graph,
  startTown: string,
  endTown: string,
) => Promise<{
  source: string;
  target: string;
}[]>

const searchMethodDict: Record<SearchMethodId, SearchFunction> = {
  'dfs': searchDFSPath,
  'bfs': searchBFSPath,
  'iddfs': searchIDDFSPath,
  'bestfs': searchBestFirstPath,
  'astar': searchAStarPath,
}

/**
 * Takes a path, start town and end town and refines the path to remove any
 * sub-paths that do not lead to the end town. Additionally, it removes any
 * duplicate paths.
 */
function refinePath(
  path: {
    source: string;
    target: string;
  }[],
  startTown: string,
  endTown: string
) {
  // Remove all duplicate paths
  const uniquePath = path.reduce(
    (acc: {source: string, target: string}[], edge, index) => {
      if (index === 0) {
        return [edge]
      }
      if (!acc.some((uniqueEdge) => uniqueEdge.source === edge.source && uniqueEdge.target === edge.target)) {
        return [...acc, edge]
      }
      return acc;
    },
    [],
  )
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

  const startTime = performance.now()
  const path = await searchMethodDict[algorithm](graph, startTown, endTown)
  const endTime = performance.now()

  const timeTakenMs = endTime - startTime
  
  const isError = path.length === 0

  return {
    path,
    timeTakenMs,
    isError,
  }
}