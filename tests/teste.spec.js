import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AuthPage } from '../pages/auth.page';

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

test.describe('Autenticação', () => {
    test('Cadastrar um usuario', async ({ page }) => {
        const auth = new AuthPage(page);
        const email = `autoplaywright+${Date.now()}@teste.com`;

        await auth.acessarPaginaAutenticacao();
        await auth.abrirCadastro();
        await auth.preencherCadastro(email, 'Senha123456');
        await auth.enviarCadastro();
        await auth.validarCadastroConcluidoComSucesso();
    });

    test('Tentar cadastrar um usuario sem informar email', async ({ page }) => {
        const auth = new AuthPage(page);

        await auth.acessarPaginaAutenticacao();
        await auth.abrirCadastro();
        await auth.preencherCadastro('', 'Senha123456');
        await auth.enviarCadastro();
        await auth.visualizarErroEmailObrigatorio();
    });

    test('Tentar cadastrar um usuario sem informar senha', async ({ page }) => {
        const auth = new AuthPage(page);
        const email = `autoplaywright+${Date.now()}@teste.com`;

        await auth.acessarPaginaAutenticacao();
        await auth.abrirCadastro();
        await auth.preencherCadastro(email, '');
        await auth.enviarCadastro();
        await auth.visualizarErroSenha();
    });

    test('Tentar cadastrar um usuario com senha inválida', async ({ page }) => {
        const auth = new AuthPage(page);
        const email = `autoplaywright+${Date.now()}@teste.com`;

        await auth.acessarPaginaAutenticacao();
        await auth.abrirCadastro();
        await auth.preencherCadastro(email, '123');
        await auth.enviarCadastro();
        await auth.visualizarErroSenha();
    });

    test('Tentar cadastrar um usuario já existente', async ({ page }) => {
        const auth = new AuthPage(page);
        const email = `autoplaywright+${Date.now()}@teste.com`;
        const senha = 'Senha123456';

        await auth.cadastrarUsuario(email, senha);

        await auth.acessarPaginaAutenticacao();
        await auth.abrirCadastro();
        await auth.preencherCadastro(email, senha);
        await auth.enviarCadastro();
        await auth.visualizarErroUsuarioExistente();
    });

    test('Realizar login', async ({ page }) => {
        const auth = new AuthPage(page);
        const email = `autoplaywright+${Date.now()}@teste.com`;
        const senha = 'Senha123456';

        await auth.cadastrarUsuario(email, senha);

        await auth.acessarPaginaAutenticacao();
        await auth.abrirLogin();
        await auth.preencherLogin(email, senha);
        await auth.enviarLogin();
        await auth.validarLoginFoiProcessado();
        await auth.validarExpiracaoToken(1); // Validar expiração do token em 1 dia
    });

    test('Realizar login com opção lembrar-me', async ({ page }) => {
        const auth = new AuthPage(page);
        const email = `autoplaywright+${Date.now()}@teste.com`;
        const senha = 'Senha123456';

        await auth.cadastrarUsuario(email, senha);

        await auth.acessarPaginaAutenticacao();
        await auth.abrirLogin();
        await auth.preencherLogin(email, senha);
        await auth.marcarLembrarMe();
        await auth.enviarLogin();
        await auth.validarLoginFoiProcessado();
        await auth.validarExpiracaoToken(30); // Validar expiração do token em 30 dias para lembrar-me
    });

    test('Tentar realizar login com senha incorreta', async ({ page }) => {
        const auth = new AuthPage(page);
        const email = `autoplaywright+${Date.now()}@teste.com`;
        const senha = 'Senha123456';

        await auth.cadastrarUsuario(email, senha);

        await auth.acessarPaginaAutenticacao();
        await auth.abrirLogin();
        await auth.preencherLogin(email, 'SenhaErrada');
        await auth.enviarLogin();
        await auth.visualizarErroLoginNaoAutorizado();
    });
});