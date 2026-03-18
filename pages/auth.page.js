import { expect } from '@playwright/test';
import { Utils } from '../support/utils';

export class AuthPage {
    constructor(page) {
        this.page = page;
        this.botaoCriarConta = page.getByRole('button', { name: 'Crie uma agora' });
        this.botaoFazerLogin = page.getByRole('button', { name: 'Faça o login' });
        this.checkboxLembrarMe = page.locator('#remember-me');
        this.erroEmailObrigatorio = page.locator('#erro-register-email');
        this.erroSenhaObrigatoria = page.locator('#erro-register-password');
        this.formCadastro = page.locator('#register-form');
        this.formLogin = page.locator('#login-form');
        this.mensagemCadastro = page.locator('#register-message');
        this.mensagemLogin = page.locator('#login-message');
        this.inputCadastroEmail = page.locator('#register-email');
        this.inputCadastroSenha = page.locator('#register-password');
        this.inputLoginEmail = page.locator('#login-email');
        this.inputLoginSenha = page.locator('#login-password');
    }

    async validarExpiracaoToken(dias) {
        const hoje = new Date();
        const expiracaoEsperada = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);
        const margem = 5 * 60 * 1000; // 5 minutos de margem

        const tokenJwt = await this.page.evaluate(() => localStorage.getItem('jwt_token'));
        const dataExpiracao = Utils.obterDataExpiracaoJwt(tokenJwt);

        const diff = Math.abs(dataExpiracao.getTime() - expiracaoEsperada.getTime());
        expect(diff).toBeLessThanOrEqual(margem);
    };

    async cadastrarUsuario(email, senha) {
        await this.acessarPaginaAutenticacao();
        await this.abrirCadastro();
        await this.preencherCadastro(email, senha);
        await this.enviarCadastro();
    }

    async acessarPaginaAutenticacao() {
        await this.page.goto('/auth.html');
    }

    async abrirCadastro() {
        const cadastroVisivel = await this.formCadastro.isVisible();
        if (!cadastroVisivel) {
            await this.botaoCriarConta.click();
        }
    }

    async preencherCadastro(email, senha) {
        await this.inputCadastroEmail.fill(email);
        await this.inputCadastroSenha.fill(senha);
    }

    async enviarCadastro() {
        await this.formCadastro.getByRole('button', { name: 'Registrar' }).click();
    }

    async abrirLogin() {
        const loginVisivel = await this.formLogin.isVisible();
        if (!loginVisivel) {
            await this.botaoFazerLogin.click();
        }
    }

    async preencherLogin(email, senha) {
        await this.inputLoginEmail.fill(email);
        await this.inputLoginSenha.fill(senha);
    }

    async marcarLembrarMe() {
        await this.checkboxLembrarMe.check();
    }

    async enviarLogin() {
        await this.formLogin.getByRole('button', { name: 'Entrar' }).click();
    }

    async obterMensagemCadastro() {
        return this.mensagemCadastro.innerText();
    }

    async validarCadastroConcluidoComSucesso() {
        await expect.poll(async () => {
            const mensagem = await this.obterMensagemCadastro();
            return mensagem.trim();
        }, { timeout: 10000 }).toContain('Registro bem-sucedido');
    }

    async visualizarErroEmailObrigatorio() {
        await expect(this.erroEmailObrigatorio).toContainText('Digite um e-mail válido.');
    }

    async visualizarErroSenha() {
        await expect(this.erroSenhaObrigatoria).toContainText('A senha deve ter no mínimo 6 caracteres.');
    }

    async visualizarErroUsuarioExistente() {
        await expect.poll(async () => {
            const mensagem = await this.obterMensagemCadastro();
            return mensagem.trim();
        }, { timeout: 10000 }).toContain('Usuário já existe');
    }

    async visualizarErroLoginNaoAutorizado() {
        await expect.poll(async () => {
            const mensagem = await this.obterMensagemLogin();
            return mensagem.trim();
        }, { timeout: 10000 }).toContain('Não autorizado');
    }

    async obterMensagemLogin() {
        return this.mensagemLogin.innerText();
    }

    async validarLoginFoiProcessado() {
        await expect.poll(async () => {
            const mensagem = await this.obterMensagemLogin();
            return mensagem.trim();
        }, { timeout: 10000 }).toMatch(/Não autorizado|Muitas tentativas|sucesso|bem-sucedido/i);
    }
}
