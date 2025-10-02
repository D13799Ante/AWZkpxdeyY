// 代码生成时间: 2025-10-03 01:36:23
import { Module, HttpException, HttpStatus } from '@nestjs/common';
import { VirtualizationService } from './virtualization.service';
import { VirtualizationController } from './virtualization.controller';

// VirtualizationModule is responsible for managing virtualization-related operations
@Module({
  controllers: [VirtualizationController],
  providers: [VirtualizationService],
  exports: [VirtualizationService],
})
export class VirtualizationModule {}

/* VirtualizationController handles incoming HTTP requests related to virtual machines */
import { Controller, Get, Post, Body, Query, NotFoundException, Res } from '@nestjs/common';
import { VirtualizationService } from './virtualization.service';
import { VirtualMachine } from './entities/virtual-machine.entity';

@Controller('virtualization')
export class VirtualizationController {
  constructor(private readonly virtualizationService: VirtualizationService) {}

  @Get('list')
  async listVMs(): Promise<VirtualMachine[]> {
    return this.virtualizationService.listVMs();
  }

  @Post('create')
  async createVM(@Body() vmData: VirtualMachine): Promise<VirtualMachine> {
    return this.virtualizationService.createVM(vmData);
  }
}

/* VirtualizationService provides business logic for virtualization operations */
import { Injectable } from '@nestjs/common';
import { VirtualMachine } from './entities/virtual-machine.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class VirtualizationService {
  private vmList: VirtualMachine[] = [];

  async createVM(vmData: VirtualMachine): Promise<VirtualMachine> {
    const vm = { ...vmData, id: nanoid() } as VirtualMachine;
    this.vmList.push(vm);
    return vm;
  }

  async listVMs(): Promise<VirtualMachine[]> {
    return this.vmList;
  }
}

/* VirtualMachine.entity defines the structure of a virtual machine */
export class VirtualMachine {
  id: string;
  name: string;
  memory: number;
  storage: number;
  os: string;
}
