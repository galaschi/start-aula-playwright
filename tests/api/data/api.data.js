import { faker } from '@faker-js/faker';

export function somenteDigitos(valor) {
    return String(valor).replace(/\D/g, '');
}

export function gerarCpfFormatado() {
    const numeros = faker.string.numeric(11);
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
}

export function criarUsuarioApi() {
    const cpf = gerarCpfFormatado();

    return {
        nome: faker.person.fullName(),
        cpf,
        data_nascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().slice(0, 10),
        email: faker.internet.email({ firstName: 'apihatstore', provider: 'teste.com' }).toLowerCase(),
        password: faker.internet.password({
            length: 12,
            memorable: false,
            pattern: /[A-Za-z0-9]/,
            prefix: 'Aa1'
        })
    };
}

export function criarPayloadPedido({ usuario, hat }) {
    return {
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        telefone: '(51) 99999-9999',
        endereco: faker.location.streetAddress(),
        numero: String(faker.number.int({ min: 1, max: 9999 })),
        bairro: faker.location.city(),
        cep: faker.location.zipCode('#####-###'),
        cidade: faker.location.city(),
        uf: 'RS',
        pagamento: 'pix',
        cupom: '',
        itens: [
            {
                id: hat.id,
                nome: hat.nome,
                price: hat.price,
                quantidade: 1
            }
        ]
    };
}