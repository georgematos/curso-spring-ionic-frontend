import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  public produtos: Array<ProdutoDTO>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(this.navParams.get("id"))
      .subscribe(
        respose => {
          this.produtos = respose['content'];
          loader.dismiss()
          this.loadImageUrls();
        }, error => {
          loader.dismiss()
        }
      );
  };

  loadImageUrls() {
    for (var i = 0; i < this.produtos.length; i++) {
      let item = this.produtos[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        }, error => { });
    }
  }

  showDetails(produto_id: ProdutoDTO) {
    this.navCtrl.push('ProdutoDetailPage', { produto_id: produto_id });
  }

  presentLoading(): Loading {
    let loader = this.loadingCtrl.create({
      content: "Por favor aguarde..."
    });
    loader.present();
    return loader;
  }

}
