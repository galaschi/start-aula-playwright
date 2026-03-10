import { expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;
        this.campoBusca = page.getByPlaceholder('Buscar chapéu...');
        this.titulosChapeusVisiveis = page.locator('h3:visible');
        this.campoPrecoMinimo = page.getByRole('spinbutton', { name: 'Mínimo' });
        this.campoPrecoMaximo = page.getByRole('spinbutton', { name: 'Máximo' });
        this.botaoAplicarPreco = page.locator('#filter-form').getByRole('button', { name: 'Aplicar' });
        this.nomeItemCarrinho = page.locator('.cart-item-nome');
        this.categorias = {
            Nacional: page.getByRole('checkbox', { name: 'Nacional', exact: true }),
            Internacional: page.getByRole('checkbox', { name: 'Internacional', exact: true }),
            Crescer: page.getByRole('checkbox', { name: 'Crescer', exact: true })
        };
    }

    async acessarPaginaInicial() {
        await this.page.goto('/');
    }

    async buscarProduto(nomeProduto) {
        await this.campoBusca.fill(nomeProduto);
    }

    async adicionarProdutoAoCarrinho(nomeProduto) {
        await this.page.locator(`button.add-to-cart-btn[data-nome="${nomeProduto}"]`).click();
    }

    async selecionarCategoria(categoriasMarcadas) {
        for (const [nome, checkbox] of Object.entries(this.categorias)) {
            if (categoriasMarcadas.includes(nome)) {
                await checkbox.check();
            } else {
                await checkbox.uncheck();
            }
        }
    }

    async categoriaEstaMarcada(nomeCategoria) {
        return this.categorias[nomeCategoria].isChecked();
    }

    async validarCategoriasMarcadas(categoriasMarcadas) {
        for (const [nome, checkbox] of Object.entries(this.categorias)) {
            if (categoriasMarcadas.includes(nome)) {
                await expect(checkbox).toBeChecked();
            } else {
                await expect(checkbox).not.toBeChecked();
            }
        }
    }

    async obterQuantidadeDeProdutosVisiveis() {
        return this.titulosChapeusVisiveis.count();
    }

    async validarQuantidadeDeProdutosVisiveis(quantidadeEsperada) {
        await expect.poll(async () => {
            return this.obterQuantidadeDeProdutosVisiveis();
        }).toBe(quantidadeEsperada);
    }

    async obterTitulosDeProdutosVisiveis() {
        const titulos = await this.titulosChapeusVisiveis.allInnerTexts();
        return titulos.map((titulo) => titulo.trim());
    }

    async validarTitulosDeProdutosVisiveis(listaEsperada) {
        await expect.poll(async () => {
            return this.obterTitulosDeProdutosVisiveis();
        }).toEqual(expect.arrayContaining(listaEsperada));
    }

    async obterNomeDoItemNoCarrinho() {
        return this.nomeItemCarrinho.innerText();
    }

    async validarItemNoCarrinho(nomeProduto) {
        await expect.poll(async () => {
            const item = await this.obterNomeDoItemNoCarrinho();
            return item.trim();
        }).toBe(nomeProduto);
    }

    async preencherFaixaDePreco(minimo, maximo) {
        await this.campoPrecoMinimo.fill(String(minimo));
        await this.campoPrecoMaximo.fill(String(maximo));
    }

    async aplicarFiltroDePreco() {
        await this.botaoAplicarPreco.click();
    }
}
