// 代码生成时间: 2025-09-04 15:26:57
import { Injectable } from '@nestjs/common';

interface MathOperationError extends Error {
  status: number;
}

@Injectable()
export class MathCalculatorService {

  // Adds two numbers and returns the result
  add(a: number, b: number): number {
    return a + b;
  }

  // Subtracts one number from another and returns the result
  subtract(a: number, b: number): number {
    return a - b;
  }

  // Multiplies two numbers and returns the result
  multiply(a: number, b: number): number {
    return a * b;
  }

  // Divides one number by another and returns the result
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero.');
    }
    return a / b;
  }

  // Calculates the power of a number and returns the result
  power(a: number, b: number): number {
    return Math.pow(a, b);
  }

  // Calculates the square root of a number and returns the result
  sqrt(a: number): number {
    if (a < 0) {
      throw new Error('Cannot calculate the square root of a negative number.');
    }
    return Math.sqrt(a);
  }

  // Error handling method for division
  private handleError(operation: string, a: number, b: number, error: MathOperationError): never {
    throw new Error(`Math operation ${operation} failed: ${error.message}`);
  }
}
