import { test } from '../../fixtures/hat-store.fixture';
import { cenariosLoginInvalidoFrontend, cenariosLoginInvalidoBackend } from '../data/login.data';

test.describe('Login', () => {
    test('Login positivo com usuário cadastrado', async ({ authPage }) => {
        await authPage.acessarPaginaAutenticacao();
        await authPage.abrirLogin();
        await authPage.preencherLogin('autoplaywright@teste.com', 'Senha123456');
        await authPage.enviarLogin();
        await authPage.validarMensagemLogin(/Login bem-sucedido/i);
        await authPage.validarRedirecionamentoParaHome();
    });

    for (const cenario of cenariosLoginInvalidoFrontend) {
        test(`Login negativo - ${cenario.descricao}`, async ({ authPage }) => {
            await authPage.acessarPaginaAutenticacao();
            await authPage.abrirLogin();
            await authPage.preencherLogin(cenario.email, cenario.senha);
            await authPage.enviarLogin();
            await authPage.validarFormularioLoginInvalido();
        });
    }

    for (const cenario of cenariosLoginInvalidoBackend) {
        test(`Login negativo - ${cenario.descricao}`, async ({ authPage }) => {
            await authPage.acessarPaginaAutenticacao();
            await authPage.abrirLogin();
            await authPage.preencherLogin(cenario.email, cenario.senha);
            await authPage.enviarLogin();
            await authPage.validarMensagemLogin(/Não autorizado|Muitas tentativas/i);
        });
    }
});
