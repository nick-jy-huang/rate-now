import fs from 'fs';

export function readCache(cacheFile: string) {
  if (!fs.existsSync(cacheFile)) return null;
  try {
    const data = fs.readFileSync(cacheFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function writeCache(cacheFile: string, history: any[], lastUpdated: number) {
  const data = { history, lastUpdated };
  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2), 'utf-8');
}
