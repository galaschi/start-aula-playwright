import { expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

export class HatStoreSteps {
    constructor(page) {
        this.home = new HomePage(page);
    }

    async dadoQueAcessoAHome() {
        await this.home.acessarPaginaInicial();
    }

    async quandoBuscoPorUmProduto(nomeProduto) {
        await this.home.buscarProduto(nomeProduto);
    }

    async quandoAdicionoProdutoAoCarrinho(nomeProduto) {
        await this.home.adicionarProdutoAoCarrinho(nomeProduto);
    }

    async entaoDevoVerProdutoNoCarrinho(nomeProduto) {
        await expect.poll(async () => {
            const item = await this.home.obterNomeDoItemNoCarrinho();
            return item.trim();
        }).toBe(nomeProduto);
    }

    async quandoSelecionoCategorias(categoriasMarcadas) {
        await this.home.selecionarCategoria(categoriasMarcadas);
    }

    async entaoCategoriaDeveEstarMarcada(categoriasMarcadas) {
        const categorias = ['Nacional', 'Internacional', 'Crescer'];

        for (const nome of categorias) {
            const estaMarcada = await this.home.categoriaEstaMarcada(nome);
            if (categoriasMarcadas.includes(nome)) {
                expect(estaMarcada).toBe(true);
            } else {
                expect(estaMarcada).toBe(false);
            }
        }
    }

    async entaoDevoVerQuantidadeDeProdutos(quantidade) {
        await expect.poll(async () => {
            return this.home.obterQuantidadeDeProdutosVisiveis();
        }).toBe(quantidade);
    }

    async entaoDevoVerListaDeProdutos(listaEsperada) {
        await expect.poll(async () => {
            return this.home.obterTitulosDeProdutosVisiveis();
        }).toEqual(expect.arrayContaining(listaEsperada));
    }

    async quandoFiltroPorFaixaDePreco(minimo, maximo) {
        await this.home.preencherFaixaDePreco(minimo, maximo);
        await this.home.aplicarFiltroDePreco();
    }
}
