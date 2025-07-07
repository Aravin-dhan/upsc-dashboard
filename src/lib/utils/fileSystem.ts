import fs from 'fs';
import path from 'path';

// Determine the correct data directory path
export function getDataPath(filename: string): string {
  // In Vercel serverless environment, use /tmp directory
  if (process.env.VERCEL) {
    const tmpDir = '/tmp/data';
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Copy initial data files if they don't exist in /tmp
    const sourcePath = path.join(process.cwd(), 'data', filename);
    const targetPath = path.join(tmpDir, filename);
    
    if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
      try {
        fs.copyFileSync(sourcePath, targetPath);
      } catch (error) {
        console.warn(`Could not copy ${filename} to tmp directory:`, error);
      }
    }
    
    return targetPath;
  }
  
  // In development, use the data directory
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  return path.join(dataDir, filename);
}

// Read JSON file with error handling
export async function readJSONFile<T = any>(filePath: string): Promise<T | null> {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

// Write JSON file with error handling
export async function writeJSONFile<T = any>(filePath: string, data: T): Promise<boolean> {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    return false;
  }
}

// Check if file exists
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Create directory if it doesn't exist
export function ensureDirectory(dirPath: string): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    return false;
  }
}

// Initialize data files with default content
export async function initializeDataFile<T>(filePath: string, defaultData: T): Promise<boolean> {
  try {
    if (!fs.existsSync(filePath)) {
      return await writeJSONFile(filePath, defaultData);
    }
    return true;
  } catch (error) {
    console.error(`Error initializing data file ${filePath}:`, error);
    return false;
  }
}

// Backup data file
export async function backupDataFile(filePath: string): Promise<string | null> {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup.${timestamp}`;
    
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch (error) {
    console.error(`Error backing up file ${filePath}:`, error);
    return null;
  }
}

// Get file size in bytes
export function getFileSize(filePath: string): number {
  try {
    if (!fs.existsSync(filePath)) {
      return 0;
    }
    
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error);
    return 0;
  }
}

// Get file modification time
export function getFileModificationTime(filePath: string): Date | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (error) {
    console.error(`Error getting modification time for ${filePath}:`, error);
    return null;
  }
}

// Clean up old backup files (keep only last N backups)
export async function cleanupBackups(filePath: string, keepCount: number = 5): Promise<number> {
  try {
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath);
    
    if (!fs.existsSync(dir)) {
      return 0;
    }
    
    const files = fs.readdirSync(dir);
    const backupFiles = files
      .filter(file => file.startsWith(`${filename}.backup.`))
      .map(file => ({
        name: file,
        path: path.join(dir, file),
        mtime: fs.statSync(path.join(dir, file)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    
    const filesToDelete = backupFiles.slice(keepCount);
    let deletedCount = 0;
    
    for (const file of filesToDelete) {
      try {
        fs.unlinkSync(file.path);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting backup file ${file.path}:`, error);
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error(`Error cleaning up backups for ${filePath}:`, error);
    return 0;
  }
}
