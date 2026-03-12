import { test as base, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { HomePage } from '../pages/home.page';
import { criarUsuarioUnico } from '../tests/data/login.data';

export const test = base.extend({
    authPage: async ({ page }, use) => {
        await use(new AuthPage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    usuarioDinamico: async ({}, use) => {
        await use(criarUsuarioUnico());
    }
});

export { expect };