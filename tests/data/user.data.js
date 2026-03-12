import { faker } from '@faker-js/faker';

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

    return { email, senha };
}