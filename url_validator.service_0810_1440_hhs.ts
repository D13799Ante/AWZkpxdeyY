// 代码生成时间: 2025-08-10 14:40:52
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, AxiosResponse } from 'rxjs';
import { URL, URLSearchParams } from 'url';
import { catchError } from 'rxjs/operators';

/**
 * 服务类，用于验证URL链接的有效性
 */
@Injectable()
export class UrlValidatorService {
    private readonly validSchemes = ['http:', 'https:'];

    constructor(private httpService: HttpService) {}

    /**
     * 验证URL链接是否有效，包括协议和主机
     * @param url 需要验证的URL字符串
     * @returns Promise<boolean> URL是否有效
     */
    async validateUrl(url: string): Promise<boolean> {
        try {
            // 尝试解析URL
            const parsedUrl = new URL(url);
            // 验证协议是否有效
            if (!this.validSchemes.includes(parsedUrl.protocol)) {
                throw new Error('Invalid URL scheme');
            }
            // 验证主机是否有效
            if (!parsedUrl.hostname) {
                throw new Error('Invalid URL host');
            }
            // 发送HEAD请求验证URL是否可达
            const response = await firstValueFrom(this.httpService.head(url).pipe(catchError(error => {
                // 处理请求错误
                throw new Error('URL is not reachable');
            })));
            // 检查响应状态码是否在2xx范围内，表示成功
            return response.status >= 200 && response.status < 300;
        } catch (error) {
            // 捕获并记录错误，返回false表示URL无效
            console.error(error);
            return false;
        }
    }
}
