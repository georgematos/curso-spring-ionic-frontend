import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {

  public produto: ProdutoDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public cartService: CartService
  ) { }

  ionViewDidLoad() {
    let produto_id = this.navParams.get('produto_id');
    this.produtoService.getById(produto_id)
      .subscribe(respose => {
        this.produto = respose;
        this.loadImageUrlIfExists();
      }, error => { });
  }

  loadImageUrlIfExists() {
    this.produtoService.getImageFromBucket(this.produto.id)
      .subscribe(response => {
        this.produto.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.produto.id}.jpg`;
      }, error => { });
  }

  addToCart(produto: ProdutoDTO) {
    this.cartService.adicionarProduto(produto);
    this.navCtrl.setRoot('CartPage');
  }
}
