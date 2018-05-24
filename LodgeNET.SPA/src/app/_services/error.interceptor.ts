import { Injectable } from "@angular/core";
import { 
    HttpInterceptor, 
    HttpEvent, 
    HttpHandler, 
    HttpRequest, 
    HttpErrorResponse, 
    HTTP_INTERCEPTORS 
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).catch(error => {
            if (error instanceof HttpErrorResponse) {
                const applicationError = error.headers.get('Application-Error');
                if (applicationError) {
                    return Observable.throw(applicationError);
                }
                const serverError = error.error;
                let modelStateErrors = '';
                if (serverError && typeof serverError === 'object') {
                    for (const key in serverError) {
                        if (serverError[key]) {
                            modelStateErrors += serverError[key] + '\n';
                        }
                    }
                }
                return Observable.throw(
                    modelStateErrors || serverError || 'Server Error'
                );
            }
        })
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};

// OLD ERROR HANDLER 
// private handleError(error: any) {
//     if (error.status === 400) {
//         return Observable.throw(error._body);
//     }
//     const applicationError = error.headers.get('Application-Error');
//     if (applicationError) {
//         return Observable.throw(applicationError);
//     }
//     const serverError = error.json();
//     let modelStateErrors = '';
//     if (serverError) {
//         for (const key in serverError) {
//             if (serverError[key]) {
//                 modelStateErrors += serverError[key] + '\n';
//             }
//         }
//     }
//     return Observable.throw(
//         modelStateErrors || 'Server Error'
//     );
// }