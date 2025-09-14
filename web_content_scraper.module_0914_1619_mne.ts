// 代码生成时间: 2025-09-14 16:19:55
import { Module } from '@nestjs/common';
import { WebContentScraperService } from './web-content-scraper.service';
import { PuppeteerService } from './puppeteer.service';

@Module({
  providers: [WebContentScraperService, PuppeteerService],
  exports: [WebContentScraperService],
})
export class WebContentScraperModule {}

/**
 * WebContentScraperService is a service responsible for scraping web content.
 * It uses Puppeteer to navigate through a webpage and extract content.
 */
import { Injectable, Logger } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { InjectLogger } from 'nestjs-pino';

@Injectable()
export class WebContentScraperService {
  private readonly logger = new Logger(WebContentScraperService.name);

  constructor(
    private readonly puppeteerService: PuppeteerService,
    @InjectLogger() private readonly loggerService: Logger,
  ) {}

  /**
   * Scrapes content from a given URL.
   * @param url The URL from which to scrape content.
   * @returns A promise that resolves to the scraped content.
   */
  async scrapeContent(url: string): Promise<string> {
    try {
      this.loggerService.log(`Scraping content from: ${url}`);
      const browser = await this.puppeteerService.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const content = await page.content();
      await browser.close();
      return content;
    } catch (error) {
      this.logger.error(`Failed to scrape content from: ${url}`, error);
      throw new Error(`Failed to scrape content from: ${url}`);
    }
  }
}

/**
 * PuppeteerService is a service that manages Puppeteer browser sessions.
 * It provides methods to launch and close the browser.
 */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  /**
   * Launches a new Puppeteer browser instance.
   * @returns A promise that resolves to the launched browser instance.
   */
  async launch(): Promise<puppeteer.Browser> {
    return await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  /**
   * Closes the Puppeteer browser instance.
   * @param browser The browser instance to close.
   */
  async close(browser: puppeteer.Browser): Promise<void> {
    return await browser.close();
  }
}
