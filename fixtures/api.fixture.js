import { test as base, expect } from '@playwright/test';
import { criarUsuarioApi } from '../tests/api/data/api.data';

const API_BASE_URL = process.env.BASE_URL || 'https://hatstore-prd.fly.dev';

function montarAuthorization(token) {
    if (token.toLowerCase().startsWith('bearer ')) {
        return token;
    }

    return `Bearer ${token}`;
}

export const test = base.extend({
    apiContext: [async ({ playwright }, use) => {
        const apiContext = await playwright.request.newContext({
            baseURL: API_BASE_URL,
            extraHTTPHeaders: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        await use(apiContext);
        await apiContext.dispose();
    }, { scope: 'worker' }],

    apiUser: [async ({}, use) => {
        await use(criarUsuarioApi());
    }, { scope: 'worker' }],

    authToken: [async ({ apiContext, apiUser }, use) => {
        const registerResponse = await apiContext.post('/auth/register', { data: apiUser });
        expect([201, 409]).toContain(registerResponse.status());

        const loginResponse = await apiContext.post('/auth/login', {
            data: {
                email: apiUser.email,
                password: apiUser.password,
                rememberMe: false
            }
        });

        expect(loginResponse.ok()).toBeTruthy();
        const loginBody = await loginResponse.json();
        expect(typeof loginBody.token).toBe('string');

        await use(loginBody.token);
    }, { scope: 'worker' }],

    authHeader: [async ({ authToken }, use) => {
        await use(montarAuthorization(authToken));
    }, { scope: 'worker' }]
});

export { expect };