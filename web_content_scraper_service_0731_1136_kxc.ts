// 代码生成时间: 2025-07-31 11:36:15
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, AxiosResponse } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * WebContentScraperService is a service that allows for the scraping of web content.
 * It uses the NestJS framework and Axios for making HTTP requests to scrape网页内容.
 */
@Injectable()
export class WebContentScraperService {
  constructor(private httpService: HttpService) {}

  /**
   * Scrapes the content of the specified URL.
   * @param url The URL to scrape.
   * @returns A promise resolving to the scraped web content.
   */
  async scrapeContent(url: string): Promise<string> {
    try {
      // Perform an HTTP GET request to the specified URL.
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(url).pipe(map((res) => res.data))
      );

      // Return the content of the response, which should be the HTML of the webpage.
      return response;
    } catch (error) {
      // Handle errors that may occur during the HTTP request.
      throw new Error(`Failed to scrape content from ${url}: ${error.message}`);
    }
  }
}