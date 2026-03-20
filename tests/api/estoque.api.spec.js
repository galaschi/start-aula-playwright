import { test, expect } from '../../fixtures/api.fixture';
import { validarContratoEstoque, validarContratoHatComEstoque } from './support/contracts';
import { getJson } from './support/helpers';

test.describe('Estoque', () => {
    test('GET /api/estoque deve listar estoque', async ({ apiContext }) => {
        const estoque = await getJson(apiContext, '/api/estoque');
        expect(Array.isArray(estoque)).toBeTruthy();
        expect(estoque.length).toBeGreaterThan(0);

        for (const item of estoque) {
            validarContratoEstoque(item);
        }
    });

    test('PATCH /api/hats/{id}/estoque deve atualizar e restaurar o estoque', async ({ apiContext }) => {
        const estoque = await getJson(apiContext, '/api/estoque');

        const alvo = estoque.find((item) => item.quantidade < 200) || estoque[0];
        expect(alvo).toBeTruthy();

        const quantidadeOriginal = alvo.quantidade;
        const quantidadeNova = quantidadeOriginal === 200 ? 199 : quantidadeOriginal + 1;

        const patchResponse = await apiContext.patch(`/api/hats/${alvo.id}/estoque`, {
            data: { quantidade: quantidadeNova }
        });

        expect(patchResponse.status()).toBe(200);
        const body = await patchResponse.json();
        validarContratoHatComEstoque(body);
        expect(body.id).toBe(alvo.id);
        expect(body.quantidade).toBe(quantidadeNova);

        await apiContext.patch(`/api/hats/${alvo.id}/estoque`, {
            data: { quantidade: quantidadeOriginal }
        });
    });

    test('PATCH /api/hats/{id}/estoque com id inexistente deve retornar 404', async ({ apiContext }) => {
        const response = await apiContext.patch('/api/hats/999999/estoque', {
            data: { quantidade: 10 }
        });

        expect(response.status()).toBe(404);
    });
});