// 代码生成时间: 2025-08-25 20:11:03
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, AuthGuard } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';
import { Item } from './interfaces/item.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@ApiTags('items')
@ApiBearerAuth()
@Controller('items')
@UseGuards(AuthGuard())
export class ItemsController {

  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({ summary: '获取所有项目' })
  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @ApiOperation({ summary: '根据ID获取项目' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item #${id} not found`);
    }
    return item;
  }

  @ApiOperation({ summary: '创建新项目' })
  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @ApiOperation({ summary: '更新项目' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.itemsService.update(id, updateItemDto);
    if (!item) {
      throw new NotFoundException(`Item #${id} not found`);
    }
    return item;
  }

  @ApiOperation({ summary: '删除项目' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.itemsService.remove(id);
    if (!result) {
      throw new NotFoundException(`Item #${id} not found`);
    }
  }
}

// DTOs
// create-item.dto.ts
export class CreateItemDto {
  // Define the structure for creating an item
}

// update-item.dto.ts
export class UpdateItemDto {
  // Define the structure for updating an item
}

// Service
// items.service.ts
import { Injectable } from '@nestjs/common';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {
  private readonly items: Item[] = [];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  create(createItemDto: CreateItemDto): Item {
    const item: Item = { id: Date.now().toString(), ...createItemDto };
    this.items.push(item);
    return item;
  }

  update(id: string, updateItemDto: UpdateItemDto): Item | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    const item = { ...this.items[index], ...updateItemDto };
    this.items[index] = item;
    return item;
  }

  remove(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}

// Interface
// item.interface.ts
export interface Item {
  id: string;
  // Other properties
}
