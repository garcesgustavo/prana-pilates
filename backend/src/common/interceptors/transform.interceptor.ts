
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    meta: any;
    error: null;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => ({
                data: data || null, // Ensure data is never undefined
                meta: {}, // Default empty meta, can be overridden by specific controllers if needed (though challenging with this simple interceptor)
                // A more advanced pattern would look for meta in the response, but for now this standardizes the structure.
                error: null,
            })),
        );
    }
}
