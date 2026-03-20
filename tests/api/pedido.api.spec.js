import { test, expect } from '../../fixtures/api.fixture';
import { criarPayloadPedido } from './data/api.data';
import { validarContratoPedido } from './support/contracts';
import { buscarHats, obterHatDisponivel } from './support/helpers';

test.describe('Pedido', () => {
    test('POST /api/pedido deve criar pedido autenticado com contrato válido', async ({ apiContext, authHeader, apiUser }) => {
        const hats = await buscarHats(apiContext);
        const hatDisponivel = obterHatDisponivel(hats);

        const payload = criarPayloadPedido({
            usuario: apiUser,
            hat: hatDisponivel
        });

        const response = await apiContext.post('/api/pedido', {
            headers: {
                Authorization: authHeader
            },
            data: payload
        });

        expect(response.status()).toBe(201);
        const body = await response.json();
        validarContratoPedido(body);
        expect(body.cpf).toContain(payload.cpf);
        expect(body.total).toBeGreaterThan(0);
    });

    test('POST /api/pedido sem autenticação deve retornar 401', async ({ apiContext }) => {
        const hats = await buscarHats(apiContext);

        const usuarioFake = {
            nome: 'Usuario Sem Auth',
            cpf: '123.456.789-00',
            email: 'sem-auth@teste.com'
        };

        const payload = criarPayloadPedido({
            usuario: usuarioFake,
            hat: hats[0]
        });

        const response = await apiContext.post('/api/pedido', {
            data: payload
        });

        expect(response.status()).toBe(401);
    });
});