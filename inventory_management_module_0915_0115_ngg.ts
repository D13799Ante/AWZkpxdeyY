// 代码生成时间: 2025-09-15 01:15:27
import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';

// InventoryModule 是库存管理系统的主要模块
@Module({
  imports: [TypeOrmModule.forFeature([InventoryEntity])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

// InventoryService 负责库存的业务逻辑
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private inventoryRepository: Repository<InventoryEntity>,
  ) {}

  // 添加库存项
  async addInventory(item: InventoryEntity): Promise<InventoryEntity> {
    try {
      return await this.inventoryRepository.save(item);
    } catch (error) {
      throw new Error('Failed to add inventory item');
    }
  }

  // 获取所有库存项
  async getAllInventories(): Promise<InventoryEntity[]> {
    try {
      return await this.inventoryRepository.find();
    } catch (error) {
      throw new Error('Failed to retrieve inventories');
    }
  }

  // 更新库存项
  async updateInventory(item: InventoryEntity): Promise<InventoryEntity> {
    try {
      return await this.inventoryRepository.save(item);
    } catch (error) {
      throw new Error('Failed to update inventory item');
    }
  }

  // 删除库存项
  async deleteInventory(id: number): Promise<void> {
    try {
      await this.inventoryRepository.delete(id);
    } catch (error) {
      throw new Error('Failed to delete inventory item');
    }
  }
}

// InventoryController 负责处理HTTP请求
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryEntity } from './inventory.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // 创建一个新的库存项
  @Post()
  async addInventory(@Body() item: InventoryEntity): Promise<InventoryEntity> {
    return await this.inventoryService.addInventory(item);
  }

  // 获取所有库存项
  @Get()
  async getAllInventories(): Promise<InventoryEntity[]> {
    return await this.inventoryService.getAllInventories();
  }

  // 更新一个库存项
  @Put(':id')
  async updateInventory(@Param('id') id: number, @Body() item: InventoryEntity): Promise<InventoryEntity> {
    item.id = id;
    return await this.inventoryService.updateInventory(item);
  }

  // 删除一个库存项
  @Delete(':id')
  async deleteInventory(@Param('id') id: number): Promise<void> {
    return await this.inventoryService.deleteInventory(id);
  }
}

// InventoryEntity 是库存项的数据库模型
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class InventoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;
}