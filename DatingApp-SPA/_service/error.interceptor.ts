// this class use to format the output error
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError(error => {
            // if request is unauthenticated show the error statusText
            if (error.status === 401 ) {
                console.log("why still errorr");
                return throwError(error.statusText);
            }
            if (error instanceof HttpErrorResponse) {
                const applicationError = error.headers.get('Application-Error'); // 500 internal server error
                if (applicationError) {
                    return throwError(applicationError);
                }
                const serverError = error.error;
                let modalStatusErrors = ''; // an empty string to show error message latter
                // if an error for invalid input of username or password
                // write all the error message into modalStatusErrors
                if (serverError.errors && typeof serverError.errors === 'object') {
                    for (const key in serverError.errors) {
                        if (serverError.errors[key]) {
                            modalStatusErrors += serverError.errors[key] + '\n';
                        }
                    }
                }
                // return modalStatusErrors when it is a error for invalid input of username or password
                // return serverError when user name already exists
                // return 'Server Error' when the error is unknown
                return throwError(modalStatusErrors || serverError || 'Server Error');
            }
        })
    );
  }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};