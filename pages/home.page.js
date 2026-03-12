import { expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;
        this.campoBusca = page.getByPlaceholder('Buscar chapéu...');
        this.titulosChapeusVisiveis = page.locator('h3:visible');
        this.campoPrecoMinimo = page.locator('#preco-min');
        this.campoPrecoMaximo = page.locator('#preco-max');
        this.botaoAplicarPreco = page.locator('#filter-form').getByRole('button', { name: 'Aplicar' });
        this.nomeItemCarrinho = page.locator('.cart-item-nome');
        this.botaoCarrinhoHeader = page.locator('#header-cart-btn');
        this.botaoFinalizarCompra = page.getByRole('button', { name: 'Finalizar compra' });
        this.mensagemNenhumChapeu = page.getByText('Nenhum chapéu encontrado.');
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
        const botaoAdicionar = this.page.locator(`button.add-to-cart-btn[data-nome="${nomeProduto}"]`);

        await expect(botaoAdicionar).toBeVisible({ timeout: 10000 });
        await expect(botaoAdicionar).toBeEnabled();
        await botaoAdicionar.scrollIntoViewIfNeeded();
        await botaoAdicionar.click();
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

    async validarQuantidadeDeProdutosVisiveisMaiorQue(quantidadeMinima) {
        await expect.poll(async () => {
            return this.obterQuantidadeDeProdutosVisiveis();
        }).toBeGreaterThan(quantidadeMinima);
    }

    async obterTitulosDeProdutosVisiveis() {
        const titulos = await this.titulosChapeusVisiveis.allInnerTexts();
        return titulos.map((titulo) => titulo.trim());
    }

    async obterAssinaturaProdutosVisiveis() {
        const titulos = await this.obterTitulosDeProdutosVisiveis();
        return titulos.sort().join('|');
    }

    async validarTitulosDeProdutosVisiveis(listaEsperada) {
        await expect.poll(async () => {
            const atual = await this.obterTitulosDeProdutosVisiveis();
            return atual.sort();
        }).toEqual(listaEsperada.sort());
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

    async abrirCarrinho() {
        await expect(this.botaoCarrinhoHeader).toBeVisible();
        await this.botaoCarrinhoHeader.click();
    }

    async irParaCheckout() {
        await expect(this.botaoFinalizarCompra).toBeVisible();
        await this.botaoFinalizarCompra.click();
    }

    async validarFeedbackBuscaSemResultados() {
        await expect(this.mensagemNenhumChapeu).toBeVisible();
    }

    async preencherFaixaDePreco(minimo, maximo) {
        await this.campoPrecoMinimo.fill(String(minimo));
        await this.campoPrecoMaximo.fill(String(maximo));
    }

    async aplicarFiltroDePreco() {
        const assinaturaAntes = await this.obterAssinaturaProdutosVisiveis();

        await expect(this.botaoAplicarPreco).toBeVisible();
        await expect(this.botaoAplicarPreco).toBeEnabled();
        await this.botaoAplicarPreco.click();

        await expect.poll(async () => {
            const assinaturaDepois = await this.obterAssinaturaProdutosVisiveis();
            return assinaturaDepois !== assinaturaAntes;
        }, { timeout: 10000 }).toBe(true);
    }
}
