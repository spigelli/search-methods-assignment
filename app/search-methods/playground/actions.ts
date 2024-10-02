'use server';
import { promises as fs } from 'fs';
import path from "path";
import { parse } from 'csv-parse/sync';
import { z } from 'zod';

async function parseCoordinates() {
// Construct the full path to the CSV file in the public folder
  const filePath = path.join(process.cwd(), 'public', 'coordinates.csv');
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
      skip_empty_lines: true
    })

    const recordsSchema = z.array(z.object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number()
    }))
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
    return adjacencySchema.parse(
      trimmedLines.map((line) => line.split(' '))
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
export type GraphData = Awaited<ReturnType<typeof getGraphData>>;