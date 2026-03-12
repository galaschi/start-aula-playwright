import { test, expect } from '../../fixtures/api.fixture';
import { criarPayloadPedido } from './data/api.data';
import { validarContratoPedido } from './support/contracts';

test.describe('Pedido', () => {
    test('POST /api/pedido deve criar pedido autenticado com contrato válido', async ({ apiContext, authHeader, apiUser }) => {
        const hatsResponse = await apiContext.get('/api/hats');
        expect(hatsResponse.ok()).toBeTruthy();

        const hats = await hatsResponse.json();
        const hatDisponivel = hats.find((hat) => hat.temEstoque || hat.quantidade > 0);
        expect(hatDisponivel).toBeTruthy();

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
        const hatsResponse = await apiContext.get('/api/hats');
        expect(hatsResponse.ok()).toBeTruthy();
        const hats = await hatsResponse.json();

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