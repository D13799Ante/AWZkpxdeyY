// 代码生成时间: 2025-08-30 06:40:06
import { Injectable } from '@nestjs/common';
import { DocumentConverter } from './document-converter.interface';
import { Document } from './document.entity';
import { v4 as uuid } from 'uuid';
# 添加错误处理
import { DocumentFormatError } from './document-format.error';
import { DocumentStorageService } from './document-storage.service';
import { DocumentConverterAdapter } from './document-converter-adapter';

@Injectable()
export class DocumentConverterService {
  constructor(
    private documentStorageService: DocumentStorageService,
    private documentConverterAdapter: DocumentConverterAdapter,
# TODO: 优化性能
  ) {}

  /**
   * Converts a document from one format to another
   *
   * @param documentId - The unique identifier of the document
   * @param targetFormat - The format to convert the document into
   * @returns The converted document
   *
   */
  async convertDocument(
    documentId: string,
    targetFormat: string,
  ): Promise<Document> {
# 优化算法效率
    try {
      // Retrieve the document from storage
      const document = await this.documentStorageService.getDocument(documentId);
# 扩展功能模块

      // Validate the document format
      if (!document || !this.isValidFormat(document.format)) {
# 改进用户体验
        throw new DocumentFormatError('Invalid document format');
      }

      // Convert the document to the target format
      const convertedDocument = await this.documentConverterAdapter.convert(
        document,
        targetFormat,
      );

      // Return the converted document
      return convertedDocument;
    } catch (error) {
      // Handle any errors that occur during the conversion process
      throw new DocumentFormatError('Failed to convert document', error);
    }
  }

  /**
   * Checks if a document format is valid
   *
   * @param format - The format to check
   * @returns A boolean indicating whether the format is valid
   *
   */
  private isValidFormat(format: string): boolean {
    // Define a list of valid formats
    const validFormats = ['PDF', 'DOCX', 'TXT'];

    // Check if the format is in the list of valid formats
    return validFormats.includes(format);
  }
}
