import { test } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import { cenariosLoginInvalidoFrontend, cenariosLoginInvalidoBackend } from '../data/login.data';

test.describe('Login', () => {
    test('Login positivo com usuário cadastrado', async ({ page }) => {
        const auth = new AuthPage(page);

        await auth.acessarPaginaAutenticacao();
        await auth.abrirLogin();
        await auth.preencherLogin('autoplaywright@teste.com', 'Senha123456');
        await auth.enviarLogin();
        await auth.validarMensagemLogin(/Login bem-sucedido/i);
        await auth.validarRedirecionamentoParaHome();
    });

    for (const cenario of cenariosLoginInvalidoFrontend) {
        test(`Login negativo - ${cenario.descricao}`, async ({ page }) => {
            const auth = new AuthPage(page);

            await auth.acessarPaginaAutenticacao();
            await auth.abrirLogin();
            await auth.preencherLogin(cenario.email, cenario.senha);
            await auth.enviarLogin();
            await auth.validarFormularioLoginInvalido();
        });
    }

    for (const cenario of cenariosLoginInvalidoBackend) {
        test(`Login negativo - ${cenario.descricao}`, async ({ page }) => {
            const auth = new AuthPage(page);

            await auth.acessarPaginaAutenticacao();
            await auth.abrirLogin();
            await auth.preencherLogin(cenario.email, cenario.senha);
            await auth.enviarLogin();
            await auth.validarMensagemLogin(/Não autorizado|Muitas tentativas/i);
        });
    }
});
