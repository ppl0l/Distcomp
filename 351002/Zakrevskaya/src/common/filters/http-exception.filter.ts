import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    let errorCode = '50000';

    // Обработка ошибок уникальности PostgreSQL
    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as any;
      
      // Ошибка уникальности (duplicate key)
      if (driverError && driverError.code === '23505') {
        status = HttpStatus.CONFLICT; // 409 Conflict
        errorMessage = 'Duplicate key violation';
        errorCode = '40901';
        
        // Извлекаем имя поля из сообщения об ошибке
        if (driverError.detail) {
          const match = driverError.detail.match(/Key \(([^)]+)\)=/);
          if (match) {
            errorMessage = `Field "${match[1]}" must be unique`;
          }
        }
      }
    }
    
    // Обработка ошибок бизнес-логики
    if (exception instanceof BusinessException) {
      status = exception.statusCode;
      errorMessage = exception.errorMessage;
      errorCode = exception.errorCode;
    } 
    // Обработка HTTP исключений
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      errorMessage = typeof responseBody === 'string' ? responseBody : (responseBody as any).message;
      errorCode = `${status}${Math.floor(Math.random() * 100)}`;
    } 
    // Обработка обычных ошибок
    else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    response.status(status).json({
      errorCode,
      errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}