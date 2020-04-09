import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  itens: Array<CartItem>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public produtoService: ProdutoService
  ) { }

  ionViewDidLoad() {
    let cart = this.cartService.getCart();
    console.log(cart)
    this.itens = cart.itens;
    this.loadImageUrls();
  }

  loadImageUrls() {
    for (var i = 0; i < this.itens.length; i++) {
      let item = this.itens[i];
      this.produtoService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response => {
          item.produto.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`;
        }, error => { });
    }
  }

}
