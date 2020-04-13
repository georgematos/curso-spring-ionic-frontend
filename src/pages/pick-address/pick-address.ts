import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];
  cliente: ClienteDTO;
  pedido: PedidoDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public clienteService: ClienteService,
    public storageService: StorageService,
    public cartService: CartService
  ) { }

  ionViewDidLoad() {
    let localUser = this.storageService.getLocalUser();

    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe((response) => {
          this.items = response['enderecos']; // poderia ser response.enderecos, mas o compilador reclamaria pos o objeto retornado nao está tipado
          let cart = this.cartService.getCart();
          this.pedido = {
            cliente: { id: response["id"] },
            enderecoDeEntrega: null,
            pagamento: null,
            itens: cart.itens.map(item => { // transforma cada item do carrinho em um objeto da lista de pedidos
              return { quantidade: item.quantidade, produto: { id: item.produto.id } }
            })
          }
        },
          (error: { status: number; }) => {
            if (error.status == 403) {
              this.navCtrl.setRoot('HomePage');
            }
          });
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  nextPage(item: EnderecoDTO) {
    this.pedido.enderecoDeEntrega = { id: item.id };
    this.navCtrl.push("PaymentPage", { pedido: this.pedido });
  }

}
