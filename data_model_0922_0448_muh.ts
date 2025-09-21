// 代码生成时间: 2025-09-22 04:48:21
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataDto } from './dto/create-data.dto';
import { Data, DataDocument } from './schemas/data.schema';

@Injectable()
export class DataModelService {
  
  // Injecting Mongoose model for Data
  constructor(@InjectModel(Data.name) private readonly dataModel: Model<DataDocument>) {}

  /*
   * Create a new data entry
   * @param createDataDto Data to create
   * @returns Promise<DataDocument> The created data document
   */
  async create(createDataDto: CreateDataDto): Promise<DataDocument> {
    try {
      const createdData = new this.dataModel(createDataDto);
      return await createdData.save();
    } catch (error) {
      // Handle error and throw
      throw new Error('Failed to create data: ' + error.message);
    }
  }

  /*
   * Find all data entries
   * @returns Promise<DataDocument[]> All data documents
   */
  async findAll(): Promise<DataDocument[]> {
    try {
      return await this.dataModel.find().exec();
    } catch (error) {
      // Handle error and throw
      throw new Error('Failed to find all data: ' + error.message);
    }
  }

  /*
   * Find a data entry by ID
   * @param id ID of the data to find
   * @returns Promise<DataDocument> The found data document
   */
  async findById(id: string): Promise<DataDocument> {
    try {
      return await this.dataModel.findById(id).exec();
    } catch (error) {
      // Handle error and throw
      throw new Error('Failed to find data by ID: ' + error.message);
    }
  }

  /*
   * Update a data entry
   * @param id ID of the data to update
   * @param createDataDto Data to update
   * @returns Promise<DataDocument> The updated data document
   */
  async update(id: string, createDataDto: CreateDataDto): Promise<DataDocument> {
    try {
      return await this.dataModel.findByIdAndUpdate(id, createDataDto).exec();
    } catch (error) {
      // Handle error and throw
      throw new Error('Failed to update data: ' + error.message);
    }
  }

  /*
   * Delete a data entry
   * @param id ID of the data to delete
   * @returns Promise<DataDocument> The deleted data document
   */
  async delete(id: string): Promise<DataDocument> {
    try {
      return await this.dataModel.findByIdAndDelete(id).exec();
    } catch (error) {
      // Handle error and throw
      throw new Error('Failed to delete data: ' + error.message);
    }
  }
}
