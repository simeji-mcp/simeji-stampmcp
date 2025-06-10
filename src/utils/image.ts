import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';
import type { StampItem } from '../types/stamp.js';
import { logCodes } from './log.js';
import { log } from './log.js';

// Determine the directory to save images
export const getSaveDir = (logId?: string): string => {
  const saveDir = logId 
    ? path.join(os.tmpdir(), 'simeji-stamps', logId)
    : path.join(os.tmpdir(), 'simeji-stamps');
  
  fs.ensureDirSync(saveDir);
  return saveDir;
};

// Open folder
export function openDirectory(dirPath: string): Promise<void> {
  return new Promise<void>((resolve) => {
    let command: string;
    log(logCodes.exec_open_directory, {
      dirPath
    });
    // Choose command to open folder based on operating system
    if (process.platform === 'win32') {
      command = `explorer "${dirPath}"`;
    } else if (process.platform === 'darwin') {
      command = `open "${dirPath}"`;
    } else {
      // Linux system
      command = `xdg-open "${dirPath}"`;
    }

    exec(command, (error) => {
      if (error) {
        log(logCodes.exec_open_directory_error, {
          error: error instanceof Error ? error.message : String(error)
        });
      }
      resolve();
    });
  });
}

/**
 * Save image to local file
 * @param stamp Stamp item
 * @param logId Log ID for directory organization
 * @returns Saved file path
 */
export async function saveImageToFile(stamp: StampItem, logId?: string): Promise<string> {
  const saveDir = getSaveDir(logId);
  const timestamp = Date.now();
  const fileName = `stamp-${stamp.id}-${timestamp}.${stamp.format || 'png'}`;
  const filePath = path.join(saveDir, fileName);
  try {
    // Get image and save
    const response = await fetch(stamp.url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error(`[Image] Failed to save image: ${error}`);
    log(logCodes.exec_save_images_error, {
      error: error instanceof Error ? error.message : String(error)
    });
    return '';
  }
}

/**
 * Batch process and save images to local files
 * @param stamps Array of stamp items
 * @param logId Log ID for directory organization
 * @returns Array of saved file paths
 */
export async function processAndSaveImages(stamps: StampItem[], logId?: string): Promise<string[]> {
  if (!stamps || stamps.length === 0) {
    return [];
  }

  try {
    // Process all image URLs in parallel
    const filePaths = await Promise.all(
      stamps.map(stamp => saveImageToFile(stamp, logId))
    );

    // Filter out empty paths from failed saves
    return filePaths.filter(path => path !== '');
  } catch (error) {
    console.error(`[Image] Batch image processing failed: ${error}`);
    return [];
  }
}