import { test, expect } from '../../fixtures/api.fixture';
import { validarContratoHatComEstoque } from './support/contracts';

test.describe('Produtos', () => {
    test('GET /api/hats deve listar chapéus', async ({ apiContext }) => {
        const response = await apiContext.get('/api/hats');
        expect(response.ok()).toBeTruthy();

        const hats = await response.json();
        expect(Array.isArray(hats)).toBeTruthy();
        expect(hats.length).toBeGreaterThan(0);

        for (const hat of hats) {
            validarContratoHatComEstoque(hat);
        }
    });

    test('GET /api/hats com filtros deve respeitar categoria e faixa de preço', async ({ apiContext }) => {
        const response = await apiContext.get('/api/hats?categoria=nacional&min=50&max=150');
        expect(response.ok()).toBeTruthy();

        const hats = await response.json();
        expect(Array.isArray(hats)).toBeTruthy();

        for (const hat of hats) {
            validarContratoHatComEstoque(hat);
            expect(hat.price).toBeGreaterThanOrEqual(50);
            expect(hat.price).toBeLessThanOrEqual(150);
            expect(String(hat.categoria).toLowerCase()).toContain('nacional');
        }
    });

    test('GET /api/hats com categoria inválida deve retornar lista vazia', async ({ apiContext }) => {
        const response = await apiContext.get('/api/hats?categoria=nao-existe');
        expect(response.ok()).toBeTruthy();

        const hats = await response.json();
        expect(Array.isArray(hats)).toBeTruthy();
        expect(hats.length).toBe(0);
    });
});