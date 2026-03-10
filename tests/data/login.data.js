import { faker } from '@faker-js/faker';

export const cenariosLogin = {
    loginValido: {
        email: 'autoplaywright@teste.com',
        senha: 'Senha123456'
    }
};

export const cenariosLoginInvalidoFrontend = [
    { descricao: 'email em branco', email: '', senha: 'Senha123456' },
    { descricao: 'senha em branco', email: 'autoplaywright@teste.com', senha: '' }
];

export const cenariosLoginInvalidoBackend = [
    { descricao: 'senha incorreta', email: 'autoplaywright@teste.com', senha: 'SenhaErrada' }
];

export const cenariosCadastroInvalido = [
    { descricao: 'email com formato inválido', email: 'email-invalido', senha: 'Senha123456' },
    { descricao: 'senha muito curta', email: 'autoplaywright@teste.com', senha: '123' },
    { descricao: 'email em branco', email: '', senha: 'Senha123456' },
    { descricao: 'senha em branco', email: 'autoplaywright@teste.com', senha: '' }
];

export function criarUsuarioUnico() {
    const email = faker.internet.email({
        firstName: 'autoplaywright',
        provider: 'teste.com'
    }).toLowerCase();
    const senha = faker.internet.password({
        length: 12,
        memorable: false,
        pattern: /[A-Za-z0-9]/,
        prefix: 'Aa1'
    });

    return {
        email,
        senha
    };
}
