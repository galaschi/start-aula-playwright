import { expect } from '@playwright/test';

export async function getJson(apiContext, url, options = {}) {
    const response = await apiContext.get(url, options);
    expect(response.ok()).toBeTruthy();
    return response.json();
}

export async function buscarHats(apiContext) {
    return getJson(apiContext, '/api/hats');
}

export function obterHatDisponivel(hats) {
    const hat = hats.find((h) => h.temEstoque || h.quantidade > 0);
    expect(hat).toBeTruthy();
    return hat;
}
