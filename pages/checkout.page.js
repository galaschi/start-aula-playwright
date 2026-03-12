import { expect } from '@playwright/test';

export class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.nomeInput = page.locator('#nome');
        this.cpfInput = page.locator('#cpf');
        this.emailInput = page.locator('#email');
        this.telefoneInput = page.locator('#telefone');
        this.enderecoInput = page.locator('#endereco');
        this.numeroInput = page.locator('#numero');
        this.bairroInput = page.locator('#bairro');
        this.cepInput = page.locator('#cep');
        this.cidadeInput = page.locator('#cidade');
        this.ufInput = page.locator('#uf');
        this.pixBtn = page.locator('#btn-pix');
        this.boletoBtn = page.locator('#btn-boleto');
        this.finalizarBtn = page.locator('.checkout-form-btn').first();
        this.codigoPagamento = page.locator('#codigo-pagamento');
        this.fecharModalPagamento = page.locator('#fechar-modal-pagamento');
    }

    async preencherDadosPessoais(dados) {
        await this.nomeInput.fill(dados.nome);
        await this.cpfInput.fill(dados.cpf);
        await this.emailInput.fill(dados.email);
        await this.telefoneInput.fill(dados.telefone);
    }

    async preencherEndereco(endereco) {
        await this.enderecoInput.fill(endereco.logradouro);
        await this.numeroInput.fill(String(endereco.numero));
        await this.bairroInput.fill(endereco.bairro);
        await this.cepInput.fill(endereco.cep);
        await this.cidadeInput.fill(endereco.cidade);
        await this.ufInput.fill(endereco.uf);
    }

    async selecionarPagamento(metodo) {
        if (metodo.toLowerCase() === 'pix') {
            await this.pixBtn.click();
            return;
        }

        await this.boletoBtn.click();
    }

    async finalizarCompra() {
        await expect(this.finalizarBtn).toBeVisible();
        await this.finalizarBtn.click();
    }

    async obterCodigoPagamento() {
        await expect(this.codigoPagamento).toBeVisible();
        const codigo = await this.codigoPagamento.innerText();
        return codigo.trim();
    }

    async fecharModalPagamentoSeVisivel() {
        if (await this.fecharModalPagamento.isVisible()) {
            await this.fecharModalPagamento.click();
        }
    }

    async acessarMeusPedidos() {
        const menu = this.page.locator('nav');
        await menu.getByText(/Meus Pedidos/i).first().click();
    }

    async validarConsultaPedido(palavrasChave) {
        await expect.poll(async () => {
            const conteudo = (await this.page.locator('body').innerText()).toLowerCase();
            return palavrasChave.some((valor) => conteudo.includes(String(valor).toLowerCase()));
        }, { timeout: 10000 }).toBe(true);
    }
}