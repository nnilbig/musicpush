import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { HistoryData } from './types.js';

const HISTORY_PATH = path.resolve(process.cwd(), 'data/history.json');

export async function loadHistory(): Promise<HistoryData> {
  try {
    const raw = await readFile(HISTORY_PATH, 'utf-8');
    return JSON.parse(raw) as HistoryData;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { recommendedIds: [] };
    }
    throw err;
  }
}

export async function saveHistory(history: HistoryData): Promise<void> {
  await mkdir(path.dirname(HISTORY_PATH), { recursive: true });
  await writeFile(HISTORY_PATH, `${JSON.stringify(history, null, 2)}\n`, 'utf-8');
}
