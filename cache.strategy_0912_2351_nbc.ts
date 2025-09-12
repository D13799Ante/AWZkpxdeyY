// 代码生成时间: 2025-09-12 23:51:10
import {
  CacheInterceptor,
  CACHE_MANAGER,
  CacheManager,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class CacheStrategy {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    private reflector: Reflector,
  ) {}

  /*
   * This method intercepts the method call and checks for cache.
   * If cache exists, return from cache, otherwise proceed with original method.
   * After method execution, store the result in cache.
   */
  async intercept(context: any, call$: Observable<any>): Promise<Observable<any>> {
    const isCached = this.reflector.get<string[]>('cache', context.getHandler());
    if (!isCached) {
      return call$;
    }
    const key = this.getKey(context);
    try {
      const cachedResponse = await this.cacheManager.get(key);
      if (cachedResponse) {
        return new Observable(observer => {
          observer.next(cachedResponse);
          observer.complete();
        });
      }
    } catch (error) {
      // Handle cache error, e.g., log it or rethrow
      console.error('Cache error:', error);
    }
    const data = await call$.toPromise();
    await this.cacheManager.set(key, data);
    return new Observable(observer => {
      observer.next(data);
      observer.complete();
    });
  }

  /*
   * This method generates a unique key for the cache based on the method name
   * and parameters.
   */
  private getKey(context: any): string {
    const { methodName, args } = context.getArgs()[0];
    const key = `${context.getClass().name}.${methodName}`;
    return key;
  }
}

/*
 * cache.interceptor.ts
 * This interceptor uses the CacheStrategy to manage caching.
 *
 * @author Your Name
 * @date 2023-05-01
 */
import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheStrategy } from './cache.strategy';

export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CacheStrategy) private cacheStrategy: CacheStrategy) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        tap(async () => {
          await this.cacheStrategy.intercept(context, next.handle());
        }),
      );
  }
}

/*
 * decorators/cache.decorator.ts
 * Decorator to mark methods as cacheable.
 *
 * @author Your Name
 * @date 2023-05-01
 */
import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache';

export const Cache = () => SetMetadata(CACHE_KEY_METADATA, true);

/*
 * usage in a controller
 *
 * @Cache()
 * async getCachedData(): Promise<any> {
 *   const data = await this.service.getData();
 *   return data;
 * }
 */
