import { test } from '../../fixtures/hat-store.fixture';
import { cenariosCadastroInvalido, cenariosLogin } from '../data/login.data';

test.describe('Cadastro de usuário', () => {
    test('Cadastro positivo com massa dinâmica', async ({ authPage, usuarioDinamico }) => {
        await authPage.acessarPaginaAutenticacao();
        await authPage.abrirCadastro();
        await authPage.preencherCadastro(usuarioDinamico.email, usuarioDinamico.senha);
        await authPage.enviarCadastro();
        await authPage.validarMensagemCadastro(/Registro bem-sucedido/i);
        await authPage.validarCampoEmailCadastro(usuarioDinamico.email);
    });

    test('Cadastro negativo - usuário já existente', async ({ authPage }) => {
        const { email, senha } = cenariosLogin.loginValido;

        await authPage.acessarPaginaAutenticacao();
        await authPage.abrirCadastro();
        await authPage.preencherCadastro(email, senha);
        await authPage.enviarCadastro();
        await authPage.validarMensagemCadastro(/já cadastrado|já existe|Email.*em uso/i);
    });

    for (const cenario of cenariosCadastroInvalido) {
        test(`Cadastro negativo - ${cenario.descricao}`, async ({ authPage }) => {
            await authPage.acessarPaginaAutenticacao();
            await authPage.abrirCadastro();
            await authPage.preencherCadastro(cenario.email, cenario.senha);
            await authPage.enviarCadastro();
            await authPage.validarFormularioCadastroInvalido();
        });
    }
});
