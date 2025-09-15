// 代码生成时间: 2025-09-15 20:17:25
// todo.controller.spec.ts
// 单元测试框架

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { getTodoRepositoryToken } from './todo.repository';
import { TodoEntity } from './todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

// Mock repository
class TodoRepositoryMock extends Repository<TodoEntity> {}

describe('TodoController', () => {
  let app: INestApplication;
  let todoRepositoryMock: TodoRepository<TodoEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: getTodoRepositoryToken(),
          useClass: TodoRepositoryMock,
        },
      ],
      imports: [TypeOrmModule.forFeature([TodoEntity])],
    }).compile();

    app = module.createNestApplication();
    todoRepositoryMock = module.get<TodoRepository<TodoEntity>>(getTodoRepositoryToken());
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('GET /todos', () => {
    it('should return an array of todos', async () => {
      jest.spyOn(todoRepositoryMock, 'find').mockResolvedValue([]);
      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a single todo', async () => {
      const todo = new TodoEntity();
      jest.spyOn(todoRepositoryMock, 'findOne').mockResolvedValue(todo);
      const response = await request(app.getHttpServer())
        .get('/todos/1')
        .expect(200);
      expect(response.body).toEqual(todo);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      jest.spyOn(todoRepositoryMock, 'findOne').mockResolvedValue(null);
      const response = await request(app.getHttpServer())
        .get('/todos/1')
        .expect(404);
      expect(response.body).toMatchObject({ statusCode: 404, message: 'Not Found' });
    });
  });

  // Add more test cases as needed...
});