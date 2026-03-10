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
    const timestamp = Date.now();

    return {
        email: `autoplaywright+${timestamp}@teste.com`,
        senha: 'Senha123456'
    };
}
