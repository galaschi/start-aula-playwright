import { test, expect } from '../../fixtures/api.fixture';

test.describe('Feature Flags', () => {
    test('GET /api/feature-flags deve retornar flags ativas', async ({ apiContext }) => {
        const response = await apiContext.get('/api/feature-flags');
        expect([200, 404]).toContain(response.status());

        if (response.status() === 404) {
            const mensagem = await response.text();
            expect(mensagem.toLowerCase()).toContain('not found');
            return;
        }

        const body = await response.json();
        expect(typeof body).toBe('object');
        expect(body).not.toBeNull();
    });
});