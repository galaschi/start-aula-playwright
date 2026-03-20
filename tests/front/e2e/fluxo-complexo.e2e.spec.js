import { test, expect } from '../../../fixtures/hat-store.fixture';

test.describe('Fluxo complexo E2E', () => {
    test.beforeEach(async ({ authPage, massaFluxoE2E }) => {
        await authPage.acessarPaginaAutenticacao();
        await authPage.abrirCadastro();
        await authPage.preencherCadastro(massaFluxoE2E.cadastro.email, massaFluxoE2E.cadastro.senha);
        await authPage.enviarCadastro();
        await authPage.validarMensagemCadastro(/Registro bem-sucedido/i);

        await authPage.abrirLogin();
        await authPage.preencherLogin(massaFluxoE2E.cadastro.email, massaFluxoE2E.cadastro.senha);
        await authPage.enviarLogin();
        await authPage.validarMensagemLogin(/Login bem-sucedido/i);
        await authPage.validarRedirecionamentoParaHome();
    });

    test('Cadastro -> Login -> Busca -> Carrinho -> Checkout -> Consulta de pedido', async ({ homePage, checkoutPage, massaFluxoE2E }) => {
        await homePage.buscarProduto(massaFluxoE2E.produto);
        await homePage.adicionarProdutoAoCarrinho(massaFluxoE2E.produto);
        await homePage.validarItemNoCarrinho(massaFluxoE2E.produto);

        await homePage.abrirCarrinho();
        await homePage.irParaCheckout();

        await checkoutPage.preencherDadosPessoais(massaFluxoE2E.checkout);
        await checkoutPage.preencherEndereco(massaFluxoE2E.checkout.endereco);
        await checkoutPage.selecionarPagamento('pix');
        await checkoutPage.finalizarCompra();

        const codigoPagamento = await checkoutPage.obterCodigoPagamento();
        expect(codigoPagamento).not.toBe('');
        const cpfFormatado = massaFluxoE2E.checkout.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

        await checkoutPage.fecharModalPagamentoSeVisivel();
        await checkoutPage.acessarMeusPedidos();
        await checkoutPage.consultarPedidosPorCpf(massaFluxoE2E.checkout.cpf);
        await checkoutPage.validarConsultaPedido([
            massaFluxoE2E.checkout.nome,
            cpfFormatado,
            massaFluxoE2E.produto,
            'pix'
        ]);
    });

    test('Deve manter item no carrinho ao retornar à home', async ({ homePage, massaFluxoE2E }) => {
        await homePage.buscarProduto(massaFluxoE2E.produto);
        await homePage.adicionarProdutoAoCarrinho(massaFluxoE2E.produto);
        await homePage.validarItemNoCarrinho(massaFluxoE2E.produto);

        await homePage.acessarPaginaInicial();
        await homePage.validarItemNoCarrinho(massaFluxoE2E.produto);
    });
});