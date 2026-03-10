import { test } from '../../fixtures/hat-store.fixture';
import { cenariosLoginInvalidoFrontend, cenariosLoginInvalidoBackend } from '../data/login.data';

test.describe('Login', () => {
    test('Login positivo com usuário cadastrado', async ({ steps, dados }) => {
        const { email, senha } = dados.cenariosLogin.loginValido;

        await steps.dadoQueAcessoPaginaDeLogin();
        await steps.quandoRealizoLogin(email, senha);
        await steps.entaoMensagemDeLoginDeveConter(/Login bem-sucedido/i);
        await steps.entaoDeveSerRedirecionadoParaHome();
    });

    for (const cenario of cenariosLoginInvalidoFrontend) {
        test(`Login negativo - ${cenario.descricao}`, async ({ steps }) => {
            await steps.dadoQueAcessoPaginaDeLogin();
            await steps.quandoRealizoLogin(cenario.email, cenario.senha);
            await steps.entaoFormularioDeLoginDeveSerInvalido();
        });
    }

    for (const cenario of cenariosLoginInvalidoBackend) {
        test(`Login negativo - ${cenario.descricao}`, async ({ steps }) => {
            await steps.dadoQueAcessoPaginaDeLogin();
            await steps.quandoRealizoLogin(cenario.email, cenario.senha);
            await steps.entaoMensagemDeLoginDeveConter(/Não autorizado|Muitas tentativas/i);
        });
    }
});
