import { test } from '../../fixtures/hat-store.fixture';
import { cenariosCadastroInvalido } from '../data/login.data';

test.describe('Cadastro de usuário', () => {
    test('Cadastro positivo com massa dinâmica', async ({ steps, dados }) => {
        const usuario = dados.criarUsuarioUnico();

        await steps.dadoQueAcessoPaginaDeLogin();
        await steps.quandoRealizoCadastro(usuario.email, usuario.senha);
        await steps.entaoMensagemDeCadastroDeveConter(/Registro bem-sucedido/i);
        await steps.entaoCampoEmailCadastroDeveConter(usuario.email);
    });

    test('Cadastro negativo - usuário já existente', async ({ steps, dados }) => {
        const { email, senha } = dados.cenariosLogin.loginValido;

        await steps.dadoQueAcessoPaginaDeLogin();
        await steps.quandoRealizoCadastro(email, senha);
        await steps.entaoMensagemDeCadastroDeveConter(/já cadastrado|já existe|Email.*em uso/i);
    });

    for (const cenario of cenariosCadastroInvalido) {
        test(`Cadastro negativo - ${cenario.descricao}`, async ({ steps }) => {
            await steps.dadoQueAcessoPaginaDeLogin();
            await steps.quandoRealizoCadastro(cenario.email, cenario.senha);
            await steps.entaoFormularioDeCadastroDeveSerInvalido();
        });
    }
});
