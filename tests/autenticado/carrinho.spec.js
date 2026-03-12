import { test } from '../../fixtures/hat-store.fixture';

async function capturar(page, testInfo, descricao) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(descricao, { body: screenshot, contentType: 'image/png' });
}

test.describe('Carrinho - Usuário Autenticado', () => {
    test.beforeEach(async ({ authPage }) => {
        await authPage.acessarPaginaAutenticacao();
        await authPage.abrirLogin();
        await authPage.preencherLogin('autoplaywright@teste.com', 'Senha123456');
        await authPage.enviarLogin();
        await authPage.validarMensagemLogin(/Login bem-sucedido/i);
        await authPage.validarRedirecionamentoParaHome();
    });

    test('Deve adicionar chapéu ao carrinho após login', async ({ page, homePage }, testInfo) => {

        await homePage.acessarPaginaInicial();
        await capturar(page, testInfo, 'Home após login');

        await homePage.buscarProduto('Chapéu Fedora');
        await homePage.adicionarProdutoAoCarrinho('Chapéu Fedora');
        await homePage.validarItemNoCarrinho('Chapéu Fedora');
        await capturar(page, testInfo, 'Chapéu Fedora adicionado ao carrinho');
    });

    test('Deve manter item no carrinho ao retornar à home', async ({ page, homePage }, testInfo) => {

        await homePage.acessarPaginaInicial();
        await homePage.buscarProduto('Chapéu Floppy');
        await homePage.adicionarProdutoAoCarrinho('Chapéu Floppy');
        await homePage.validarItemNoCarrinho('Chapéu Floppy');
        await capturar(page, testInfo, 'Item adicionado');

        await homePage.acessarPaginaInicial();
        await homePage.validarItemNoCarrinho('Chapéu Floppy');
        await capturar(page, testInfo, 'Item persistido após navegação');
    });
});
