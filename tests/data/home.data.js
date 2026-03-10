export const CHAPEUS = [
    { nome: 'Chapéu Cowboy', preco: 109.9, categorias: ['Internacional'], disponivel: true },
    { nome: 'Chapéu Fedora', preco: 150.0, categorias: ['Internacional'], disponivel: true },
    { nome: 'Chapéu Floppy', preco: 79.9, categorias: ['Internacional'], disponivel: true },
    { nome: 'Chapéu Bucket', preco: 49.9, categorias: ['Internacional'], disponivel: true },
    { nome: 'Chapéu Pork Pie', preco: 59.9, categorias: ['Internacional'], disponivel: false },
    { nome: 'Chapéu Sertanejo', preco: 99.9, categorias: ['Nacional'], disponivel: true },
    { nome: 'Chapéu Cangaceiro', preco: 139.9, categorias: ['Nacional'], disponivel: true },
    { nome: 'Chapéu Gustavo Carvalho', preco: 60.0, categorias: ['Crescer'], disponivel: true },
    { nome: 'Chapéu Trilby', preco: 84.9, categorias: ['Internacional'], disponivel: true },
    { nome: 'Chapéu de Pescador', preco: 29.9, categorias: ['Nacional'], disponivel: true },
    { nome: 'Chapéu Gaúcho', preco: 129.9, categorias: ['Nacional'], disponivel: true },
    { nome: 'Chapéu Snapback', preco: 44.9, categorias: ['Nacional'], disponivel: false },
    { nome: 'Chapéu Panamá', preco: 120.0, categorias: ['Internacional'], disponivel: true },
    { nome: 'Chapéu Beanie', preco: 39.9, categorias: ['Internacional'], disponivel: true },
    { nome: 'Chapéu Bowler', preco: 69.9, categorias: ['Internacional'], disponivel: true }
];

export const CENARIOS_CATEGORIA = gerarCombinacoes(Array.from(new Set(CHAPEUS.flatMap((chapeu) => chapeu.categorias))), 1);

export const CENARIOS_FAIXA_PRECO = [
    { minimo: 0, maximo: 50 },
    { minimo: 50, maximo: 90 },
    { minimo: 90, maximo: 200 }
];

export const CENARIOS_COMBINADOS = [
    { categorias: ['Nacional'], minimo: 90, maximo: 150 },
    { categorias: ['Internacional'], minimo: 0, maximo: 70 },
    { categorias: ['Nacional', 'Crescer'], minimo: 40, maximo: 110 }
];

function gerarCombinacoes(itens, tamanhoMinimo) {
    const resultado = [];

    for (let mascara = 1; mascara < (1 << itens.length); mascara += 1) {
        const combinacao = [];

        for (let i = 0; i < itens.length; i += 1) {
            if (mascara & (1 << i)) {
                combinacao.push(itens[i]);
            }
        }

        if (combinacao.length >= tamanhoMinimo) {
            resultado.push(combinacao);
        }
    }

    return resultado;
}