import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../config/api.config"
import { HttpClient } from "@angular/common/http";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storag.service";

@Injectable()
export class AuthService {

  loginUrl: string = API_CONFIG.baseUrl+"/login";

  constructor(public http: HttpClient, public storage: StorageService) {

  }

  authenticate(creds: CredenciaisDTO) {
    return this.http.post(`${this.loginUrl}`, creds, {
      observe: 'response',
      responseType: 'text'
    })
  }

  sucessfulLogin(authorizationValue: string) {
    let tokenParam = authorizationValue.substring(7);
    let user: LocalUser = {
      token: tokenParam
    };
    this.storage.setLocalUser(user);
  }

  logout() {
    this.storage.setLocalUser(null);
  }

}
