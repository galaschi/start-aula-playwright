import { test } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { AuthPage } from '../../pages/auth.page';

async function capturar(page, testInfo, descricao) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(descricao, { body: screenshot, contentType: 'image/png' });
}

async function autenticarUsuario(page) {
    const auth = new AuthPage(page);
    await auth.acessarPaginaAutenticacao();
    await auth.abrirLogin();
    await auth.preencherLogin('autoplaywright@teste.com', 'Senha123456');
    await auth.enviarLogin();
    await auth.validarMensagemLogin(/Login bem-sucedido/i);
    await auth.validarRedirecionamentoParaHome();
}

test.describe('Carrinho - Usuário Autenticado', () => {
    test('Deve adicionar chapéu ao carrinho após login', async ({ page }, testInfo) => {
        const home = new HomePage(page);

        await autenticarUsuario(page);
        await home.acessarPaginaInicial();
        await capturar(page, testInfo, 'Home após login');

        await home.buscarProduto('Chapéu Fedora');
        await home.adicionarProdutoAoCarrinho('Chapéu Fedora');
        await home.validarItemNoCarrinho('Chapéu Fedora');
        await capturar(page, testInfo, 'Chapéu Fedora adicionado ao carrinho');
    });

    test('Deve manter item no carrinho ao retornar à home', async ({ page }, testInfo) => {
        const home = new HomePage(page);

        await autenticarUsuario(page);
        await home.acessarPaginaInicial();
        await home.buscarProduto('Chapéu Floppy');
        await home.adicionarProdutoAoCarrinho('Chapéu Floppy');
        await home.validarItemNoCarrinho('Chapéu Floppy');
        await capturar(page, testInfo, 'Item adicionado');

        await home.acessarPaginaInicial();
        await home.validarItemNoCarrinho('Chapéu Floppy');
        await capturar(page, testInfo, 'Item persistido após navegação');
    });
});
