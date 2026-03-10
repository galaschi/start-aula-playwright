import { expect } from '@playwright/test';

export class AuthPage {
    constructor(page) {
        this.page = page;
        this.botaoCriarConta = page.getByRole('button', { name: 'Crie uma agora' });
        this.botaoFazerLogin = page.getByRole('button', { name: 'Faça o login' });
        this.formCadastro = page.locator('#register-form');
        this.formLogin = page.locator('#login-form');
        this.mensagemCadastro = page.locator('#register-message');
        this.mensagemLogin = page.locator('#login-message');
        this.inputCadastroEmail = page.locator('#register-email');
        this.inputCadastroSenha = page.locator('#register-password');
        this.inputLoginEmail = page.locator('#login-email');
        this.inputLoginSenha = page.locator('#login-password');
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

    async validarMensagemCadastro(textoOuRegex) {
        await expect.poll(async () => {
            const mensagem = await this.obterMensagemCadastro();
            return mensagem.trim();
        }, { timeout: 10000 }).toMatch(textoOuRegex);
    }

    async validarCampoEmailCadastro(email) {
        await expect(this.inputCadastroEmail).toHaveValue(email);
    }

    async validarFormularioCadastroInvalido() {
        const valido = await this.formCadastro.evaluate((form) => form.checkValidity());
        expect(valido).toBe(false);
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

    async validarMensagemLogin(textoOuRegex) {
        await expect.poll(async () => {
            const mensagem = await this.obterMensagemLogin();
            return mensagem.trim();
        }, { timeout: 10000 }).toMatch(textoOuRegex);
    }

    async validarFormularioLoginInvalido() {
        const valido = await this.formLogin.evaluate((form) => form.checkValidity());
        expect(valido).toBe(false);
    }

    async validarRedirecionamentoParaHome() {
        await expect.poll(() => this.page.url(), { timeout: 6000 }).toMatch(/index\.html|\/$/i);
    }
}
