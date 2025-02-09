import { readFile } from 'fs/promises';
import { join } from 'path';
import { checkPath } from '../utils/fs-async';

export const DEFAULT_FILEPATHS = [
  '.fantasticonrc',
  'fantasticonrc',
  '.fantasticonrc.json',
  'fantasticonrc.json',
  '.fantasticonrc.js',
  'fantasticonrc.js'
];

const attemptLoading = async (filepath: string): Promise<any | void> => {
  const fileExists = await checkPath(filepath, 'file');
  if (fileExists) {
    try {
      return require(join(process.cwd(), filepath));
    } catch (err) {}

    try {
      const content = await readFile(filepath, 'utf8');
      return JSON.parse(content);
    } catch (err) {}

    throw new Error(`Failed parsing configuration at '${filepath}'`);
  }
};

export const loadConfig = async (filepath?: string) => {
  let loadedConfigPath: string | null = null;
  let loadedConfig = {};

  if (filepath) {
    loadedConfig = await attemptLoading(filepath);
    loadedConfigPath = filepath;
  } else {
    for (const path of DEFAULT_FILEPATHS) {
      loadedConfig = await attemptLoading(path);

      if (loadedConfig) {
        loadedConfigPath = path;
        break;
      }
    }
  }

  return { loadedConfig, loadedConfigPath };
};
