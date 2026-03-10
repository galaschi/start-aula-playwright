import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import {
    CHAPEUS,
    CENARIOS_CATEGORIA,
    CENARIOS_FAIXA_PRECO,
    CENARIOS_COMBINADOS
} from '../data/home.data';

test.describe('Busca e Carrinho', () => {
    test('Deve buscar produto inexistente e exibir feedback', async ({ page }) => {
        const home = new HomePage(page);

        await home.acessarPaginaInicial();
        await home.buscarProduto('Produto Inexistente 123');
        await home.validarFeedbackBuscaSemResultados();
    });
   
    for (const chapeu of CHAPEUS) {
        if (chapeu.disponivel) {
            test(`Deve buscar por ${chapeu.nome} e adicionar ao carrinho`, async ({ page }) => {
                const home = new HomePage(page);

                await home.acessarPaginaInicial();
                await home.buscarProduto(chapeu.nome);
                await home.adicionarProdutoAoCarrinho(chapeu.nome);
                await home.validarItemNoCarrinho(chapeu.nome);
                await home.validarQuantidadeDeProdutosVisiveisMaiorQue(0);
            });
        }
    }
});

test.describe('Filtros', () => {
    for (const categorias of CENARIOS_CATEGORIA) {
        test(`Deve filtrar por categorias: ${categorias.join(' + ')}`, async ({ page }) => {
            const home = new HomePage(page);

            await home.acessarPaginaInicial();
            await home.selecionarCategoria(categorias);
            await home.validarCategoriasMarcadas(categorias);

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.categorias.some((categoria) => categorias.includes(categoria)))
                .map((chapeu) => chapeu.nome)
            await home.validarTitulosDeProdutosVisiveis(resultado);
        });
    }

    for (const faixa of CENARIOS_FAIXA_PRECO) {
        test(`Deve filtrar por faixa de preço: ${faixa.minimo} a ${faixa.maximo}`, async ({ page }) => {
            const home = new HomePage(page);

            await home.acessarPaginaInicial();
            await home.preencherFaixaDePreco(faixa.minimo, faixa.maximo);
            await home.aplicarFiltroDePreco();

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.preco >= faixa.minimo && chapeu.preco <= faixa.maximo)
                .map((chapeu) => chapeu.nome);
            await home.validarTitulosDeProdutosVisiveis(resultado);
        });
    }

    for (const cenario of CENARIOS_COMBINADOS) {
        test(`Deve filtrar por categoria + preço: ${cenario.categorias.join(' + ')} e ${cenario.minimo}-${cenario.maximo}`, async ({ page }) => {
            const home = new HomePage(page);

            await home.acessarPaginaInicial();
            await home.selecionarCategoria(cenario.categorias);
            await home.validarCategoriasMarcadas(cenario.categorias);
            await home.preencherFaixaDePreco(cenario.minimo, cenario.maximo);
            await home.aplicarFiltroDePreco();

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.preco >= cenario.minimo && chapeu.preco <= cenario.maximo)
                .filter((chapeu) => chapeu.categorias.some((categoria) => cenario.categorias.includes(categoria)))
                .map((chapeu) => chapeu.nome);
            await home.validarTitulosDeProdutosVisiveis(resultado);
        });
    }
});

test.describe('Regressão Visual', () => {
    test('Home deve manter o layout esperado', async ({ page }) => {
        const home = new HomePage(page);

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Hat Store' })).toBeVisible();
        await home.validarQuantidadeDeProdutosVisiveis(CHAPEUS.length);

        await expect(page).toHaveScreenshot('home-base.png', {
            fullPage: true,
            animations: 'disabled',
            maxDiffPixelRatio: 0.03
        });
    });
});
