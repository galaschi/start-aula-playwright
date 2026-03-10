import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HatStoreSteps } from '../steps/hat-store.steps';
import { cenariosLogin, criarUsuarioUnico } from '../tests/data/login.data';

export const test = base.extend({
    paginaLogin: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    steps: async ({ page }, use) => {
        await use(new HatStoreSteps(page));
    },

    dados: async ({}, use) => {
        await use({ criarUsuarioUnico, cenariosLogin });
    },

    logado: async ({ page }, use) => {
        const login = new LoginPage(page);
        await login.acessarPaginaDeLogin();
        await login.abrirLogin();
        await login.preencherLogin('autoplaywright@teste.com', 'Senha123456');
        await login.enviarLogin();
        await page.waitForURL(/index\.html|\/$/, { timeout: 10000 });
        await use(page);
    },

    evidencia: async ({ page }, use, testInfo) => {
        await use({
            capturar: async (descricao) => {
                const screenshot = await page.screenshot({ fullPage: true });
                await testInfo.attach(descricao, { body: screenshot, contentType: 'image/png' });
            }
        });
        if (testInfo.status !== testInfo.expectedStatus) {
            const screenshot = await page.screenshot({ fullPage: true });
            await testInfo.attach('estado-na-falha', { body: screenshot, contentType: 'image/png' });
        }
    },
});

export { expect };
