import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request?.headers?.authorization?.split(' ')[1];
    if (!bearerToken) {
      return handler.handle();
    }
    const decodedToken = jwt.verify(bearerToken, process.env.JWT_SECRET);
    request.user = { ...decodedToken, id: decodedToken.userId };
    return handler.handle();
  }
}
