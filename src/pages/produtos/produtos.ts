import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, Refresher } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  public produtos: Array<ProdutoDTO> = [];
  private page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    this.produtoService.findByCategoria(this.navParams.get("id"), this.page, 10)
      .subscribe(
        respose => {
          let start = this.produtos.length;
          this.produtos = this.produtos.concat(respose['content']);
          let end = this.produtos.length - 1;
          this.loadImageUrls(start, end);
          console.log(this.page);
          console.log(this.produtos);
        }, error => {
        }
      );
  };

  loadImageUrls(start: number, end: number)  {
    let loader = this.presentLoading();
    for (var i = start; i <= end; i++) {
      let item = this.produtos[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(
          response => {
            item.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
          }, error => { }
        );
    }
    loader.dismiss();
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

  doRefresh(refresher: Refresher) {
    this.page = 0;
    this.produtos = [];
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.ionViewDidLoad();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
