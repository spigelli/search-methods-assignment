'use server';
import { promises as fs } from 'fs';
import path from "path";
import { parse } from 'csv-parse/sync';

async function parseCoordinates() {
// Construct the full path to the CSV file in the public folder
  const filePath = path.join(process.cwd(), 'public', 'coordinates.csv');
  try {
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf-8')

    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true, // Treat the first row as header
      skip_empty_lines: true
    })

    return records
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error)
    throw new Error('Failed to read or parse CSV file')
  }
}

export async function getCityTree() {
  const coordinates = await parseCoordinates()
  console.log(coordinates)
  return 1
}