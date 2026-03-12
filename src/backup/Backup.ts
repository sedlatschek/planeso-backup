import {
  writeFile,
  rm,
} from 'fs/promises';
import JSZip from 'jszip';
import { logger } from '../logger.js';

export class Backup {
  private readonly zip: JSZip;

  public constructor() {
    this.zip = new JSZip();
  }

  public add(name: string, content: string): void {
    this.zip.file(name, content);
  }

  public async finalize(archivePath: string): Promise<void> {
    await rm(archivePath, { force: true });
    const buffer = await this.zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });
    await writeFile(archivePath, buffer);
    logger.info(`Backup created at ${archivePath} (${buffer.byteLength} total bytes)`);
  }
}
