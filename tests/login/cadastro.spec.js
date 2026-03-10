import { test } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import { cenariosCadastroInvalido, cenariosLogin, criarUsuarioUnico } from '../data/login.data';

test.describe('Cadastro de usuário', () => {
    test('Cadastro positivo com massa dinâmica', async ({ page }) => {
        const auth = new AuthPage(page);
        const usuario = criarUsuarioUnico();

        await auth.acessarPaginaAutenticacao();
        await auth.abrirCadastro();
        await auth.preencherCadastro(usuario.email, usuario.senha);
        await auth.enviarCadastro();
        await auth.validarMensagemCadastro(/Registro bem-sucedido/i);
        await auth.validarCampoEmailCadastro(usuario.email);
    });

    test('Cadastro negativo - usuário já existente', async ({ page }) => {
        const auth = new AuthPage(page);
        const { email, senha } = cenariosLogin.loginValido;

        await auth.acessarPaginaAutenticacao();
        await auth.abrirCadastro();
        await auth.preencherCadastro(email, senha);
        await auth.enviarCadastro();
        await auth.validarMensagemCadastro(/já cadastrado|já existe|Email.*em uso/i);
    });

    for (const cenario of cenariosCadastroInvalido) {
        test(`Cadastro negativo - ${cenario.descricao}`, async ({ page }) => {
            const auth = new AuthPage(page);

            await auth.acessarPaginaAutenticacao();
            await auth.abrirCadastro();
            await auth.preencherCadastro(cenario.email, cenario.senha);
            await auth.enviarCadastro();
            await auth.validarFormularioCadastroInvalido();
        });
    }
});
