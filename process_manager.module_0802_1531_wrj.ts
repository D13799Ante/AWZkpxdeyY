// 代码生成时间: 2025-08-02 15:31:42
import { Module } from '@nestjs/common';
import { ProcessManagerService } from './process_manager.service';
import { ProcessManagerController } from './process_manager.controller';

@Module({
  providers: [ProcessManagerService],
  controllers: [ProcessManagerController],
})
export class ProcessManagerModule {}

/**
 * ProcessManagerService - Service for executing process management operations.
 *
 * @class ProcessManagerService
 * @description This service handles process-related tasks such as listing and killing processes.
 */
import { Injectable } from '@nestjs/common';
import { ChildProcess, exec } from 'child_process';
import { fork } from 'child_process';
import { promisify } from 'util';
import * as psTree from 'ps-tree';
const kill = promisify(psTree.kill);

@Injectable()
export class ProcessManagerService {
  private processes: Map<string, ChildProcess> = new Map();

  constructor() {}

  /**
   * List all running processes.
   *
   * @returns {string[]} - An array of process IDs.
   */
  async listProcesses(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      exec('ps aux', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          const processes = stdout.trim().split('
');
          resolve(processes.map(process => process.split(' ')[1]));
        }
      });
    });
  }

  /**
   * Kill a process by its ID.
   *
   * @param {number} pid - The process ID to kill.
   *
   * @returns {Promise<void>} - A promise that resolves when the process is killed.
   */
  async killProcess(pid: number): Promise<void> {
    try {
      await kill(pid);
    } catch (error) {
      throw new Error(`Failed to kill process with PID ${pid}: ${error.message}`);
    }
  }

  /**
   * Fork a new process.
   *
   * @param {string} filePath - The file path of the script to run.
   *
   * @returns {ChildProcess} - The forked child process.
   */
  forkProcess(filePath: string): ChildProcess {
    const child = fork(filePath);
    this.processes.set(filePath, child);
    return child;
  }
}

/**
 * ProcessManagerController - Controller for handling HTTP requests related to process management.
 *
 * @class ProcessManagerController
 * @description This controller exposes endpoints for managing processes.
 */
import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { ProcessManagerService } from './process_manager.service';

@Controller('process-manager')
export class ProcessManagerController {
  constructor(private readonly processManagerService: ProcessManagerService) {}

  /**
   * Get a list of all running processes.
   *
   * @returns {string[]} - A list of process IDs.
   */
  @Get('/processes')
  async getProcesses(): Promise<string[]> {
    return this.processManagerService.listProcesses();
  }

  /**
   * Kill a process by its ID.
   *
   * @param {number} pid - The process ID to kill.
   *
   * @returns {void}
   */
  @Post('/kill/:pid')
  async killProcess(@Param('pid') pid: number): Promise<void> {
    await this.processManagerService.killProcess(pid);
  }
}