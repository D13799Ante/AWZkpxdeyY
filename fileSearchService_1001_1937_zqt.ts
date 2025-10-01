// 代码生成时间: 2025-10-01 19:37:44
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class FileSearchService {
  private readonly readdir = promisify(fs.readdir);
  private readonly stat = promisify(fs.stat);

  constructor() {}

  /**
   * Recursively searches for files in the specified directory.
   * @param directoryPath Path to the directory to search in.
   * @returns An Observable of file paths.
   */
  findAllFiles(directoryPath: string): Observable<string> {
    return new Observable(observer => {
      this.readdir(directoryPath)
        .then(files => {
          const fileObservables = files.map(file => {
            const filePath = path.join(directoryPath, file);
            return this.stat(filePath).then(stat => {
              if (stat.isDirectory()) {
                return this.findAllFiles(filePath);
              } else {
                observer.next(filePath);
              }
            }).catch(error => observer.error(error));
          });

          from(fileObservables).pipe(
            switchMap(obs => obs)
          ).subscribe(observer);
        })
        .catch(error => observer.error(error));
    });
  }

  /**
   * Searches for files with the specified extension in the directory.
   * @param directoryPath Path to the directory to search in.
   * @param fileExtension The file extension to filter by.
   * @returns An Observable of file paths.
   */
  findFilesByExtension(directoryPath: string, fileExtension: string): Observable<string> {
    return this.findAllFiles(directoryPath).pipe(
      switchMap(filePath => {
        return this.stat(filePath).then(stat => {
          if (stat.isFile() && filePath.endsWith('.' + fileExtension)) {
            return filePath;
          }
          return null;
        }).catch(error => {
          throw error;
        });
      }).filter(filePath => filePath !== null)
    );
  }
}
