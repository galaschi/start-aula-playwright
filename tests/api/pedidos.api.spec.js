import { test, expect } from '../../fixtures/api.fixture';
import { criarUsuarioApi } from './data/api.data';
import { validarContratoPedido } from './support/contracts';

test.describe('Pedidos', () => {
    test('GET /api/pedidos com usuário logado e sem pedidos deve retornar lista vazia', async ({ apiContext }) => {
        const usuario = criarUsuarioApi();

        const registerResponse = await apiContext.post('/auth/register', { data: usuario });
        expect(registerResponse.status()).toBe(201);

        const loginResponse = await apiContext.post('/auth/login', {
            data: {
                email: usuario.email,
                password: usuario.password,
                rememberMe: false
            }
        });
        expect(loginResponse.ok()).toBeTruthy();

        const loginBody = await loginResponse.json();
        expect(loginBody.token).toBeTruthy();

        const pedidosResponse = await apiContext.get(`/api/pedidos?cpf=${encodeURIComponent(usuario.cpf)}`, {
            headers: {
                Authorization: `Bearer ${loginBody.token}`
            }
        });

        expect(pedidosResponse.status()).toBe(200);
        const pedidos = await pedidosResponse.json();
        expect(Array.isArray(pedidos)).toBeTruthy();
        expect(pedidos.length).toBe(0);

        for (const pedido of pedidos) {
            validarContratoPedido(pedido);
        }
    });

    test('GET /api/pedidos sem autenticação deve retornar não autorizado', async ({ apiContext }) => {
        const response = await apiContext.get('/api/pedidos?cpf=110.861.597-05');
        expect(response.status()).toBe(401);
    });

    test('GET /api/pedidos sem CPF deve retornar erro de validação', async ({ apiContext, authHeader }) => {
        const response = await apiContext.get('/api/pedidos', {
            headers: {
                Authorization: authHeader
            }
        });

        expect(response.status()).toBe(400);
    });
});