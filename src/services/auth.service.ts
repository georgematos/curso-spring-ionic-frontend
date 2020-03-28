import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../config/api.config"
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AuthService {

  loginUrl: string = API_CONFIG.baseUrl+"/login";

  constructor(public http: HttpClient) {

  }

  authenticate(creds: CredenciaisDTO) {
    return this.http.post(`${this.loginUrl}`, creds, {
      observe: 'response',
      responseType: 'text'
    })
  }

}
