import { test, expect } from '../../fixtures/hat-store.fixture';
import {
    CHAPEUS,
    CENARIOS_CATEGORIA,
    CENARIOS_FAIXA_PRECO,
    CENARIOS_COMBINADOS
} from '../data/home.data';

test.describe('Busca e Carrinho', () => {
    test('Deve buscar produto inexistente e exibir feedback', async ({ homePage }) => {
        await homePage.acessarPaginaInicial();
        await homePage.buscarProduto('Produto Inexistente 123');
        await homePage.validarFeedbackBuscaSemResultados();
    });
   
    for (const chapeu of CHAPEUS) {
        if (chapeu.disponivel) {
            test(`Deve buscar por ${chapeu.nome} e adicionar ao carrinho`, async ({ homePage }) => {
                await homePage.acessarPaginaInicial();
                await homePage.buscarProduto(chapeu.nome);
                await homePage.adicionarProdutoAoCarrinho(chapeu.nome);
                await homePage.validarItemNoCarrinho(chapeu.nome);
                await homePage.validarQuantidadeDeProdutosVisiveisMaiorQue(0);
            });
        }
    }
});

test.describe('Filtros', () => {
    for (const categorias of CENARIOS_CATEGORIA) {
        test(`Deve filtrar por categorias: ${categorias.join(' + ')}`, async ({ homePage }) => {
            await homePage.acessarPaginaInicial();
            await homePage.selecionarCategoria(categorias);
            await homePage.validarCategoriasMarcadas(categorias);

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.categorias.some((categoria) => categorias.includes(categoria)))
                .map((chapeu) => chapeu.nome)
            await homePage.validarTitulosDeProdutosVisiveis(resultado);
        });
    }

    for (const faixa of CENARIOS_FAIXA_PRECO) {
        test(`Deve filtrar por faixa de preço: ${faixa.minimo} a ${faixa.maximo}`, async ({ homePage }) => {
            await homePage.acessarPaginaInicial();
            await homePage.preencherFaixaDePreco(faixa.minimo, faixa.maximo);
            await homePage.aplicarFiltroDePreco();

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.preco >= faixa.minimo && chapeu.preco <= faixa.maximo)
                .map((chapeu) => chapeu.nome);
            await homePage.validarTitulosDeProdutosVisiveis(resultado);
        });
    }

    for (const cenario of CENARIOS_COMBINADOS) {
        test(`Deve filtrar por categoria + preço: ${cenario.categorias.join(' + ')} e ${cenario.minimo}-${cenario.maximo}`, async ({ homePage }) => {
            await homePage.acessarPaginaInicial();
            await homePage.selecionarCategoria(cenario.categorias);
            await homePage.validarCategoriasMarcadas(cenario.categorias);
            await homePage.preencherFaixaDePreco(cenario.minimo, cenario.maximo);
            await homePage.aplicarFiltroDePreco();

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.preco >= cenario.minimo && chapeu.preco <= cenario.maximo)
                .filter((chapeu) => chapeu.categorias.some((categoria) => cenario.categorias.includes(categoria)))
                .map((chapeu) => chapeu.nome);
            await homePage.validarTitulosDeProdutosVisiveis(resultado);
        });
    }
});

test.describe('Regressão Visual', () => {
    test('Home deve manter o layout esperado', async ({ page, homePage }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Hat Store' })).toBeVisible();
        await homePage.validarQuantidadeDeProdutosVisiveis(CHAPEUS.length);

        await expect(page).toHaveScreenshot('home-base.png', {
            fullPage: true,
            animations: 'disabled',
            maxDiffPixelRatio: 0.03
        });
    });
});
