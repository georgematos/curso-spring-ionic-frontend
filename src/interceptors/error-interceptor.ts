import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .catch((error, caught) => {
        let errorFromApi = error;
        if (errorFromApi.error) {
          errorFromApi = errorFromApi.error;
        }
        if (!errorFromApi.status) { // se o error vier como texto puro, converte pra JSON (se tiver o attr status, então é um JSON)
          errorFromApi = JSON.parse(errorFromApi);
        }
        console.log("Erro capturado pelo interceptor");
        console.log(errorFromApi);
        return Observable.throw(errorFromApi);
      }) as any;
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
}
