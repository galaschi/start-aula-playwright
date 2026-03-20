import { test, expect } from '../../fixtures/api.fixture';
import { validarContratoHatComEstoque } from './support/contracts';
import { getJson, buscarHats } from './support/helpers';

test.describe('Produtos', () => {
    test('GET /api/hats deve listar chapéus', async ({ apiContext }) => {
        const hats = await buscarHats(apiContext);
        expect(Array.isArray(hats)).toBeTruthy();
        expect(hats.length).toBeGreaterThan(0);

        for (const hat of hats) {
            validarContratoHatComEstoque(hat);
        }
    });

    test('GET /api/hats com filtros deve respeitar categoria e faixa de preço', async ({ apiContext }) => {
        const hats = await getJson(apiContext, '/api/hats?categoria=nacional&min=50&max=150');
        expect(Array.isArray(hats)).toBeTruthy();

        for (const hat of hats) {
            validarContratoHatComEstoque(hat);
            expect(hat.price).toBeGreaterThanOrEqual(50);
            expect(hat.price).toBeLessThanOrEqual(150);
            expect(String(hat.categoria).toLowerCase()).toContain('nacional');
        }
    });

    test('GET /api/hats com categoria inválida deve retornar lista vazia', async ({ apiContext }) => {
        const hats = await getJson(apiContext, '/api/hats?categoria=nao-existe');
        expect(Array.isArray(hats)).toBeTruthy();
        expect(hats.length).toBe(0);
    });
});