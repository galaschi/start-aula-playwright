export class LoginPage {
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

    async acessarPaginaDeLogin() {
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

    async obterMensagemLogin() {
        return this.mensagemLogin.innerText();
    }
}
