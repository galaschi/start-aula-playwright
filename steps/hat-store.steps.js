import { expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';

export class HatStoreSteps {
    constructor(page) {
        this.page = page;
        this.home = new HomePage(page);
        this.login = new LoginPage(page);
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
        for (const nome of Object.keys(this.home.categorias)) {
            const estaMarcada = await this.home.categoriaEstaMarcada(nome);
            if (categoriasMarcadas.includes(nome)) {
                expect(estaMarcada).toBe(true);
            } else {
                expect(estaMarcada).toBe(false);
            }
        }
    }

    async quandoFiltroPorFaixaDePreco(minimo, maximo) {
        await this.home.preencherFaixaDePreco(minimo, maximo);
        await this.home.aplicarFiltroDePreco();
    }

    async entaoDeveExibirFeedbackDeBuscaSemResultados() {
        await expect(this.home.mensagemNenhumChapeu).toBeVisible();
    }

    async entaoDeveHaverProdutosVisiveis() {
        await expect.poll(async () => {
            return this.home.obterQuantidadeDeProdutosVisiveis();
        }).toBeGreaterThan(0);
    }

    async entaoProdutosVisteisDevemSerExatamente(listaEsperada) {
        await expect.poll(async () => {
            const atual = await this.home.obterTitulosDeProdutosVisiveis();
            return atual.sort();
        }).toEqual(listaEsperada.sort());
    }

    async dadoQueAcessoPaginaDeLogin() {
        await this.login.acessarPaginaDeLogin();
    }

    async entaoCampoEmailCadastroDeveConter(email) {
        await expect(this.login.inputCadastroEmail).toHaveValue(email);
    }

    async entaoFormularioDeCadastroDeveSerInvalido() {
        const valido = await this.login.formCadastro.evaluate((form) => form.checkValidity());
        expect(valido).toBe(false);
    }

    async entaoFormularioDeLoginDeveSerInvalido() {
        const valido = await this.login.formLogin.evaluate((form) => form.checkValidity());
        expect(valido).toBe(false);
    }

    async entaoDeveSerRedirecionadoParaHome() {
        await expect.poll(() => this.page.url(), { timeout: 6000 }).toMatch(/index\.html|\/$/i);
    }

    async quandoRealizoCadastro(email, senha) {
        await this.login.abrirCadastro();
        await this.login.preencherCadastro(email, senha);
        await this.login.enviarCadastro();
    }

    async entaoMensagemDeCadastroDeveConter(textoOuRegex) {
        await expect.poll(async () => {
            const mensagem = await this.login.obterMensagemCadastro();
            return mensagem.trim();
        }, { timeout: 10000 }).toMatch(textoOuRegex);
    }

    async quandoRealizoLogin(email, senha) {
        await this.login.preencherLogin(email, senha);
        await this.login.enviarLogin();
    }

    async entaoMensagemDeLoginDeveConter(textoOuRegex) {
        await expect.poll(async () => {
            const mensagem = await this.login.obterMensagemLogin();
            return mensagem.trim();
        }, { timeout: 10000 }).toMatch(textoOuRegex);
    }
}
