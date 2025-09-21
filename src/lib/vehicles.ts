'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { parse, stringify } from 'csv/sync';
import type { Vehicle, NewHistory } from './definitions';

const vehiclesCsvPath = path.join(process.cwd(), 'src', 'lib', 'vehicles.csv');
const historyCsvPath = path.join(process.cwd(), 'src', 'lib', 'history.csv');

async function readCsv<T>(filePath: string): Promise<T[]> {
  try {
    await fs.access(filePath);
  } catch (error) {
    return [];
  }
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
  if (!fileContent.trim()) {
    return [];
  }
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records;
}

async function writeCsv<T extends object>(filePath: string, data: T[]): Promise<void> {
  let header = true;
  if (data.length > 0) {
    try {
        await fs.access(filePath);
        const stat = await fs.stat(filePath);
        if (stat.size > 0) {
            header = false;
        }
    } catch (error) {
        // File does not exist, header should be written.
    }
  }

  const csvString = stringify(data, { header });
  if (header) {
      await fs.writeFile(filePath, csvString, { encoding: 'utf-8' });
  } else {
      await fs.appendFile(filePath, '\n' + stringify(data, { header: false }), { encoding: 'utf-8' });
  }
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  return readCsv<Vehicle>(vehiclesCsvPath);
}

export async function getVehicleByPlate(plate: string): Promise<Vehicle | null> {
  const vehicles = await getAllVehicles();
  const vehicle = vehicles.find(v => v.plate_text.toLowerCase() === plate.toLowerCase());
  return vehicle || null;
}

export async function addVehicle(vehicle: Omit<Vehicle, 'institute_id'>): Promise<void> {
    const newVehicle: Vehicle = {
        ...vehicle,
        institute_id: 'INST-001', // Mock institute ID
    };

    let vehicles = await getAllVehicles();
    vehicles.push(newVehicle);
    
    // Completely rewrite the file with the new data
    const csvString = stringify(vehicles, { header: true });
    await fs.writeFile(vehiclesCsvPath, csvString, { encoding: 'utf-8' });
}


export async function getAllHistory() {
  const history = await readCsv<any>(historyCsvPath);
  return history.map((item: any) => ({
      ...item,
      history_id: parseInt(item.history_id),
      user_id: parseInt(item.user_id),
      verified_at: new Date(item.verified_at),
  }));
}

export async function addHistory(item: NewHistory): Promise<void> {
    const history = await getAllHistory();
    const newHistoryId = history.length > 0 ? Math.max(...history.map(h => h.history_id)) + 1 : 1;
    const newRecord = {
      history_id: newHistoryId,
      user_id: 2, // Mocked user ID
      plate_text: item.plate_text,
      verified_at: new Date(),
      status: item.status,
    };
    await writeCsv(historyCsvPath, [newRecord]);
}