import { test, expect } from '../../fixtures/api.fixture';
import { criarUsuarioApi } from './data/api.data';
import { validarContratoTokenLogin } from './support/contracts';

test.describe('Autenticação ', () => {
    test('POST /auth/register deve criar usuário com sucesso', async ({ apiContext }) => {
        const usuario = criarUsuarioApi();

        const response = await apiContext.post('/auth/register', { data: usuario });
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(typeof body.message).toBe('string');
        expect(body.message.toLowerCase()).toContain('sucesso');
    });

    test('POST /auth/login deve retornar token JWT', async ({ apiContext }) => {
        const usuario = criarUsuarioApi();
        const registerResponse = await apiContext.post('/auth/register', { data: usuario });
        expect(registerResponse.status()).toBe(201);

        const response = await apiContext.post('/auth/login', {
            data: {
                email: usuario.email,
                password: usuario.password,
                rememberMe: false
            }
        });

        expect(response.ok()).toBeTruthy();
        validarContratoTokenLogin(await response.json());
    });

    test('POST /auth/register com usuário já existente deve retornar 409', async ({ apiContext }) => {
        const usuario = criarUsuarioApi();

        const primeiraResposta = await apiContext.post('/auth/register', { data: usuario });
        expect(primeiraResposta.status()).toBe(201);

        const segundaResposta = await apiContext.post('/auth/register', { data: usuario });
        expect(segundaResposta.status()).toBe(409);
    });

    test('POST /auth/login com senha inválida deve retornar erro de autenticação', async ({ apiContext }) => {
        const usuario = criarUsuarioApi();
        const registerResponse = await apiContext.post('/auth/register', { data: usuario });
        expect(registerResponse.status()).toBe(201);

        const response = await apiContext.post('/auth/login', {
            data: {
                email: usuario.email,
                password: 'SenhaErrada123',
                rememberMe: false
            }
        });

        expect([401, 429]).toContain(response.status());
    });
});