import { tmpdir } from 'os';
import {
  writeFile,
  copyFile,
  rm,
} from 'fs/promises';
import JSZip from 'jszip';
import { logger } from './logger.js';
import { join } from 'path';

export class Backup {
  private readonly path: string;
  private readonly zip: JSZip;

  public constructor() {
    this.path = join(tmpdir(), `planeso-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`);
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
    await writeFile(this.path, buffer);
    logger.info(`Backup created at ${this.path} (${buffer.byteLength} total bytes)`);
    await copyFile(this.path, archivePath);
  }
}
