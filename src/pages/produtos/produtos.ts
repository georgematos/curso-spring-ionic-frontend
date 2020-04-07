import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  public produtos: Array<ProdutoDTO>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    this.produtoService.findByCategoria(this.navParams.get("id"))
      .subscribe(respose => {
        this.produtos = respose['content'];
        this.loadImageUrls();
      },
      error => {}
    );
  };

  loadImageUrls() {
    for (var i = 0; i < this.produtos.length; i++) {
      let item = this.produtos[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        }, error => {});
    }
  }

  showDetails(item: ProdutoDTO) {
    item.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}.jpg`;
    this.navCtrl.push('ProdutoDetailPage', {item: item});
  }

}
