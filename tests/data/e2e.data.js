import { faker } from '@faker-js/faker';
import { criarUsuarioUnico } from './user.data';

function gerarCpfNumerico() {
    const base = faker.string.numeric(9);
    const digito1 = faker.number.int({ min: 0, max: 9 });
    const digito2 = faker.number.int({ min: 0, max: 9 });
    return `${base}${digito1}${digito2}`;
}

export function criarMassaFluxoE2E() {
    const cadastro = criarUsuarioUnico();

    return {
        cadastro,
        produto: 'Chapéu Floppy',
        checkout: {
            nome: faker.person.fullName(),
            cpf: gerarCpfNumerico(),
            email: cadastro.email,
            telefone: '(51) 99999-9999',
            endereco: {
                logradouro: faker.location.streetAddress(),
                numero: faker.number.int({ min: 1, max: 9999 }),
                bairro: faker.location.city(),
                cep: faker.location.zipCode('#####-###'),
                cidade: faker.location.city(),
                uf: 'RS'
            }
        }
    };
}