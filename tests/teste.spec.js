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

// Filtrar produtos por categoria
test('Filtrar por categoria', async ({ page }) => {

    // Acessar a página inicial
    await page.goto('https://hatstore-prd.fly.dev/');

    // Verificar chapéus visíveis
    await expect(page.locator('h3:visible')).toHaveCount(15);

    // Aplicar filtro de categoria: Nacional
    await page.getByRole('checkbox', { name: 'Nacional', exact: true }).check();
    await expect(page.getByRole('checkbox', { name: 'Nacional', exact: true })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Internacional', exact: true })).not.toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Crescer', exact: true })).not.toBeChecked();

    // Validar chapéus visíveis após filtro
    await expect(page.locator('h3:visible')).toHaveCount(5);
    const titulosCategoria = (await page.locator('h3:visible').allInnerTexts()).map((item) => item.trim());
    expect(titulosCategoria.sort()).toEqual([
        'Chapéu Sertanejo',
        'Chapéu Cangaceiro',
        'Chapéu Snapback',
        'Chapéu de Pescador',
        'Chapéu Gaúcho'
    ].sort());
});

// Filtrar produtos por faixa de preco
test('Filtrar por preco', async ({ page }) => {

    // Acessar a página inicial
    await page.goto('https://hatstore-prd.fly.dev/');

    // Preencher faixa e aplicar filtro
    await page.getByRole('spinbutton', { name: 'Mínimo' }).fill('50');
    await page.getByRole('spinbutton', { name: 'Máximo' }).fill('80');
    await page.locator('#filter-form').getByRole('button', { name: 'Aplicar' }).click();

    // Validar chapéus visíveis após filtro
    await expect(page.locator('h3:visible')).toHaveCount(4);
    const titulosPreco = (await page.locator('h3:visible').allInnerTexts()).map((item) => item.trim());
    expect(titulosPreco.sort()).toEqual([
        'Chapéu Floppy',
        'Chapéu Pork Pie',
        'Chapéu Gustavo Carvalho',
        'Chapéu Bowler'
    ].sort());
});