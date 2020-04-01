import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storag.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService) { }

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

        switch (errorFromApi.status) {
          case 403:
          this.handle403();
          break;
        }

        return Observable.throw(errorFromApi);
      }) as any;
  }

  handle403() {
    this.storage.setLocalUser(null);
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
}
