import { test, expect } from '@playwright/test';

// Buscar por um produto e adicionar ao carrinho
test('Buscar por um produto', async ({ page }) => {

    // Acessar a página inicial
    await page.goto('https://hatstore-prd.fly.dev/');

    // Buscar por um produto
    await page.fill('input[placeholder="Buscar chapéu..."]', 'Chapéu Floppy');

    // Adicionar item ao carrinho
    await page.click('button.add-to-cart-btn[data-nome="Chapéu Floppy"]');

    // Validar que o item foi adicionado ao carrinho
    await expect(page.locator('.cart-item-nome')).toHaveText('Chapéu Floppy');
});