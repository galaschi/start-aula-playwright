import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Busca e Carrinho', () => {
    test('Buscar por um produto e adicionar ao carrinho', async ({ page }) => {
        const home = new HomePage(page);

        await home.acessarPaginaInicial();
        await home.buscarProduto('Chapéu Floppy');
        await home.adicionarProdutoAoCarrinho('Chapéu Floppy');
        await home.validarItemNoCarrinho('Chapéu Floppy');
    });
});

test.describe('Filtros de Produtos', () => {
    test('Filtrar produtos por categoria Nacional', async ({ page }) => {
        const home = new HomePage(page);

        await home.acessarPaginaInicial();
        await home.validarQuantidadeDeProdutosVisiveis(15);
        await home.selecionarCategoria(['Nacional']);
        await home.validarCategoriasMarcadas(['Nacional']);
        await home.validarQuantidadeDeProdutosVisiveis(5);
        await home.validarTitulosDeProdutosVisiveis([
            'Chapéu Sertanejo',
            'Chapéu Cangaceiro',
            'Chapéu Snapback',
            'Chapéu de Pescador',
            'Chapéu Gaúcho'
        ]);
    });

    test('Filtrar produtos por faixa de preco', async ({ page }) => {
        const home = new HomePage(page);

        await home.acessarPaginaInicial();
        await home.preencherFaixaDePreco(50, 80);
        await home.aplicarFiltroDePreco();
        await home.validarQuantidadeDeProdutosVisiveis(4);
        await home.validarTitulosDeProdutosVisiveis([
            'Chapéu Floppy',
            'Chapéu Pork Pie',
            'Chapéu Gustavo Carvalho',
            'Chapéu Bowler'
        ]);
    });
});