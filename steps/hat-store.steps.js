import { expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AuthPage } from '../pages/auth.page';

export class HatStoreSteps {
    constructor(page) {
        this.page = page;
        this.home = new HomePage(page);
        this.auth = new AuthPage(page);
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

    async dadoQueAcessoPaginaDeAutenticacao() {
        await this.auth.acessarPaginaAutenticacao();
    }

    async quandoRealizoCadastro(email, senha) {
        await this.auth.abrirCadastro();
        await this.auth.preencherCadastro(email, senha);
        await this.auth.enviarCadastro();
    }

    async entaoCadastroDeveSerConcluidoComSucesso() {
        await expect.poll(async () => {
            const mensagem = await this.auth.obterMensagemCadastro();
            return mensagem.trim();
        }, { timeout: 10000 }).toContain('Registro bem-sucedido');
    }

    async quandoRealizoLogin(email, senha) {
        await this.auth.preencherLogin(email, senha);
        await this.auth.enviarLogin();
    }

    async entaoLoginFoiProcessado() {
        await expect.poll(async () => {
            const mensagem = await this.auth.obterMensagemLogin();
            return mensagem.trim();
        }, { timeout: 10000 }).toMatch(/Não autorizado|Muitas tentativas|sucesso/i);
    }
}
