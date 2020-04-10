import { Injectable } from "@angular/core";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";
import { StorageService } from "../storage.service";

@Injectable()
export class CartService {
  constructor(public storage: StorageService) { }

  createOrClearCart(): Cart {
    let cart: Cart = { itens: [] };
    this.storage.setCart(cart);
    return cart;
  }

  getCart(): Cart {
    let cart: Cart = this.storage.getCart();
    if (cart == null) {
      cart = this.createOrClearCart();
    }
    return cart;
  }

  adicionarProduto(produto: ProdutoDTO): Cart {
    return this.manipularCart('adicionar', produto);
  }

  removerProduto(produto: ProdutoDTO): Cart {
    return this.manipularCart('remover', produto);
  }

  aumentarQuantidade(produto: ProdutoDTO): Cart {
    return this.manipularCart('incrementar', produto);
  }

  diminuirQuantidade(produto: ProdutoDTO): Cart {
    return this.manipularCart('diminuir', produto);
  }

  private manipularCart(acao: string, produto: ProdutoDTO) {

    let cart = this.getCart();
    let position = cart.itens.findIndex(x => x.produto.id == produto.id);

    switch (acao) {
      case 'adicionar': {
        if (position == -1) { /*verifica se produto n esta no carrinho ainda*/
          cart.itens.push({ quantidade: 1, produto: produto });
        }
        break;
      }
      case 'incrementar': {
        if (position != -1) { /*verifica se produto ja esta no carrinho*/
          cart.itens[position].quantidade++;
        }
        break;
      }
      case 'diminuir': {
        if (position != -1) {
          cart.itens[position].quantidade--;
          if (cart.itens[position].quantidade < 1) {
            cart = this.removerProduto(produto);
          }
          break;
        }
      }
      case 'remover': {
        if (position != -1) {
          cart.itens.splice(position, 1);
        }
        break;
      }
    }

    this.storage.setCart(cart);
    return cart;
  }

  total(): number {
    let cart = this.getCart();
    let soma = 0;
    for (var i = 0; i < cart.itens.length; i++) {
      soma += cart.itens[i].produto.preco * cart.itens[i].quantidade;
    }
    return soma;
  }

}
