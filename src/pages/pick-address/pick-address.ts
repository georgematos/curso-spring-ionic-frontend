import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];
  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public clienteService: ClienteService,
    public storageService: StorageService
  ) { }

  ionViewDidLoad() {
    let localUser = this.storageService.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe((response) => {
          this.items = response['enderecos']; // poderia ser response.enderecos, mas o compilador reclamaria pos o objeto retornado nao está tipado
        }),
        (error: { status: number; }) => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        };
    } else {
      this.navCtrl.setRoot('HomePage');
    }

  }

}
