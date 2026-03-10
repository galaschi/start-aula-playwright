import { test } from '../../fixtures/hat-store.fixture';

test.describe('Carrinho - Usuário Autenticado', () => {
    test('Deve adicionar chapéu ao carrinho após login', async ({ steps, logado, evidencia }) => {
        await steps.dadoQueAcessoAHome();
        await evidencia.capturar('Home após login');

        await steps.quandoBuscoPorUmProduto('Chapéu Fedora');
        await steps.quandoAdicionoProdutoAoCarrinho('Chapéu Fedora');
        await steps.entaoDevoVerProdutoNoCarrinho('Chapéu Fedora');
        await evidencia.capturar('Chapéu Fedora adicionado ao carrinho');
    });

    test('Deve manter item no carrinho ao retornar à home', async ({ steps, logado, evidencia }) => {
        await steps.dadoQueAcessoAHome();
        await steps.quandoBuscoPorUmProduto('Chapéu Floppy');
        await steps.quandoAdicionoProdutoAoCarrinho('Chapéu Floppy');
        await steps.entaoDevoVerProdutoNoCarrinho('Chapéu Floppy');
        await evidencia.capturar('Item adicionado');

        await steps.dadoQueAcessoAHome();
        await steps.entaoDevoVerProdutoNoCarrinho('Chapéu Floppy');
        await evidencia.capturar('Item persistido após navegação');
    });
});
