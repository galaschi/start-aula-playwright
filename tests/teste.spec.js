import { test } from '@playwright/test';
import { HatStoreSteps } from '../steps/hat-store.steps';

test.describe('Feature: Home da Hat Store', () => {
    test('Cenário: Buscar por um produto e adicionar ao carrinho', async ({ page }) => {
        const steps = new HatStoreSteps(page);

        await steps.dadoQueAcessoAHome();
        await steps.quandoBuscoPorUmProduto('Chapéu Floppy');
        await steps.quandoAdicionoProdutoAoCarrinho('Chapéu Floppy');
        await steps.entaoDevoVerProdutoNoCarrinho('Chapéu Floppy');
    });

    test('Cenário: Filtrar produtos por categoria Nacional', async ({ page }) => {
        const steps = new HatStoreSteps(page);

        await steps.dadoQueAcessoAHome();
        await steps.entaoDevoVerQuantidadeDeProdutos(15);
        await steps.quandoSelecionoCategorias(['Nacional']);
        await steps.entaoCategoriaDeveEstarMarcada(['Nacional']);
        await steps.entaoDevoVerQuantidadeDeProdutos(5);
        await steps.entaoDevoVerListaDeProdutos([
            'Chapéu Sertanejo',
            'Chapéu Cangaceiro',
            'Chapéu Snapback',
            'Chapéu de Pescador',
            'Chapéu Gaúcho'
        ]);
    });

    test('Cenário: Filtrar produtos por faixa de preco', async ({ page }) => {
        const steps = new HatStoreSteps(page);

        await steps.dadoQueAcessoAHome();
        await steps.quandoFiltroPorFaixaDePreco(50, 80);
        await steps.entaoDevoVerQuantidadeDeProdutos(4);
        await steps.entaoDevoVerListaDeProdutos([
            'Chapéu Floppy',
            'Chapéu Pork Pie',
            'Chapéu Gustavo Carvalho',
            'Chapéu Bowler'
        ]);
    });
});