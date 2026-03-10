import { test, expect } from '../../fixtures/hat-store.fixture';
import {
    CHAPEUS,
    CENARIOS_CATEGORIA,
    CENARIOS_FAIXA_PRECO,
    CENARIOS_COMBINADOS
} from '../data/home.data';

test.describe('Busca e Carrinho', () => {
    test('Deve buscar produto inexistente e exibir feedback', async ({ steps }) => {
        await steps.dadoQueAcessoAHome();
        await steps.quandoBuscoPorUmProduto('Produto Inexistente 123');
        await steps.entaoDeveExibirFeedbackDeBuscaSemResultados();
    });
   
    for (const chapeu of CHAPEUS) {
        if (chapeu.disponivel) {
            test(`Deve buscar por ${chapeu.nome} e adicionar ao carrinho`, async ({ steps }) => {
                await steps.dadoQueAcessoAHome();
                await steps.quandoBuscoPorUmProduto(chapeu.nome);
                await steps.quandoAdicionoProdutoAoCarrinho(chapeu.nome);
                await steps.entaoDevoVerProdutoNoCarrinho(chapeu.nome);
                await steps.entaoDeveHaverProdutosVisiveis();
            });
        }
    }
});

test.describe('Filtros', () => {
    for (const categorias of CENARIOS_CATEGORIA) {
        test(`Deve filtrar por categorias: ${categorias.join(' + ')}`, async ({ steps }) => {
            await steps.dadoQueAcessoAHome();
            await steps.quandoSelecionoCategorias(categorias);
            await steps.entaoCategoriaDeveEstarMarcada(categorias);

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.categorias.some((categoria) => categorias.includes(categoria)))
                .map((chapeu) => chapeu.nome)
            await steps.entaoProdutosVisteisDevemSerExatamente(resultado);
        });
    }

    for (const faixa of CENARIOS_FAIXA_PRECO) {
        test(`Deve filtrar por faixa de preço: ${faixa.minimo} a ${faixa.maximo}`, async ({ steps }) => {
            await steps.dadoQueAcessoAHome();
            await steps.quandoFiltroPorFaixaDePreco(faixa.minimo, faixa.maximo);

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.preco >= faixa.minimo && chapeu.preco <= faixa.maximo)
                .map((chapeu) => chapeu.nome);
            await steps.entaoProdutosVisteisDevemSerExatamente(resultado);
        });
    }

    for (const cenario of CENARIOS_COMBINADOS) {
        test(`Deve filtrar por categoria + preço: ${cenario.categorias.join(' + ')} e ${cenario.minimo}-${cenario.maximo}`, async ({ steps }) => {
            await steps.dadoQueAcessoAHome();
            await steps.quandoSelecionoCategorias(cenario.categorias);
            await steps.entaoCategoriaDeveEstarMarcada(cenario.categorias);
            await steps.quandoFiltroPorFaixaDePreco(cenario.minimo, cenario.maximo);

            const resultado = CHAPEUS
                .filter((chapeu) => chapeu.preco >= cenario.minimo && chapeu.preco <= cenario.maximo)
                .filter((chapeu) => chapeu.categorias.some((categoria) => cenario.categorias.includes(categoria)))
                .map((chapeu) => chapeu.nome);
            await steps.entaoProdutosVisteisDevemSerExatamente(resultado);
        });
    }
});

test.describe('Regressão Visual', () => {
    test('Home deve manter o layout esperado', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Hat Store' })).toBeVisible();
        await expect.poll(async () => page.locator('h3:visible').count()).toBe(CHAPEUS.length);

        await expect(page).toHaveScreenshot('home-base-chromium-win32.png', {
            fullPage: true,
            animations: 'disabled',
            maxDiffPixelRatio: 0.03
        });
    });
});
