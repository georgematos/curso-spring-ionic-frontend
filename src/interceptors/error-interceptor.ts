import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storag.service";
import { AlertController } from "ionic-angular";
import { FieldMessage } from "../models/fieldmessage";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService, public alertController: AlertController) { }

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

          case 401:
          this.handle401();
          break;

          case 403:
          this.handle403();
          break;

          case 422:
          this.handle422(errorFromApi);
          break;

          default:
          this.handleDefaultError(errorFromApi);
          break;
        }

        return Observable.throw(errorFromApi);
      }) as any;
  }

  handle401() {
    let alert = this.alertController.create({
      title: 'Erro 401: Falha de autenticação',
      message: 'Email ou senha incorretos',
      enableBackdropDismiss: false,
      buttons: [
        {text: 'Ok'}
      ]
    });
    alert.present();
  }

  handle403() {
    this.storage.setLocalUser(null);
  }

  handle422(objErrors) {
    let alert = this.alertController.create({
      title: 'Erro 422: Validação',
      message: this.listErrors(objErrors.errors),
      enableBackdropDismiss: false,
      buttons: [
        {text: 'Ok'}
      ]
    });
    alert.present();
  }

  handleDefaultError(errorFromApi: any) {
    let alert = this.alertController.create({
      title: 'Erro ' + errorFromApi.status + ': ' + errorFromApi.error,
      message: errorFromApi.message,
      enableBackdropDismiss: false,
      buttons: [
        {text: 'Ok'}
      ]
    });
    alert.present();
  }

  private listErrors(messages: FieldMessage[]): string {
    let s: string = '';
    for (var i=0; i < messages.length; i++) {
      s = s + '<p><strong>' + messages[i].fieldName + '</strong> ' + messages[i].message;
    }
    return s;
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
}
