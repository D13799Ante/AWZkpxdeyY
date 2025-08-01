// 代码生成时间: 2025-08-02 07:32:04
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

/*
 * CartService: This service handles the business logic for cart operations.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CartDto } from './dto/cart.dto';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async addCartItem(cartDto: CartDto): Promise<CartEntity> {
    // Create a new cart item using the provided data.
    const cartItem = this.cartRepository.create(cartDto);
    return this.cartRepository.save(cartItem);
  }

  async removeCartItem(cartId: number): Promise<void> {
    // Remove the cart item by its ID.
    await this.cartRepository.delete(cartId);
  }

  async getCartItems(userId: number): Promise<CartEntity[]> {
    // Retrieve all cart items for a user.
    return this.cartRepository.find({ where: { userId } });
  }

  // Additional methods can be added here to handle other cart operations.
}

/*
 * CartController: This controller exposes HTTP endpoints for cart operations.
 */
import { Controller, Post, Body, Delete, Get, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addCartItem(@Body() cartDto: CartDto): Promise<CartEntity> {
    return this.cartService.addCartItem(cartDto);
  }

  @Delete(':id')
  async removeCartItem(@Param('id') cartId: number): Promise<void> {
    await this.cartService.removeCartItem(cartId);
  }

  @Get('items/:userId')
  async getCartItems(@Param('userId') userId: number): Promise<CartEntity[]> {
    return this.cartService.getCartItems(userId);
  }

  // Additional routes can be added here for other cart operations.
}

/*
 * CartEntity: This is the database entity for cart items.
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  userId: number;

  @ManyToOne(() => ProductEntity, product => product.cartItems)
  product: ProductEntity;
}

/*
 * CartDto: This DTO is used to transfer cart item data.
 */
export class CartDto {
  quantity: number;
  userId: number;
  productId: number;
}

/*
 * Note: Error handling can be implemented using NestJS's built-in exception filters
 * or using the @HttpCode and @ HttpStatus decorators on controller methods.
 * For brevity, these are not included in this example.
 */