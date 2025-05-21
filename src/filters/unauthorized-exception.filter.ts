import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>(); // Usando o tipo Response aqui
    response.status(401).json({
      statusCode: 401,
      message: 'Token expired or invalid',
      error: 'Unauthorized',
    });
  }
}
