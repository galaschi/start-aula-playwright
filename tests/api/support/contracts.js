import { expect } from '@playwright/test';

export function validarContratoHatComEstoque(hat) {
    expect(typeof hat).toBe('object');
    expect(typeof hat.id).toBe('number');
    expect(typeof hat.nome).toBe('string');
    expect(typeof hat.categoria).toBe('string');
    expect(typeof hat.price).toBe('number');

    if (hat.quantidade !== undefined) {
        expect(typeof hat.quantidade).toBe('number');
    }

    if (hat.temEstoque !== undefined) {
        expect(typeof hat.temEstoque).toBe('boolean');
    }
}

export function validarContratoEstoque(item) {
    expect(typeof item).toBe('object');
    expect(typeof item.id).toBe('number');
    expect(typeof item.nome).toBe('string');
    expect(typeof item.quantidade).toBe('number');
}

export function validarContratoTokenLogin(payload) {
    expect(typeof payload).toBe('object');
    expect(typeof payload.token).toBe('string');
    expect(payload.token.length).toBeGreaterThan(20);
}

export function validarContratoPedido(pedido) {
    expect(typeof pedido).toBe('object');
    expect(typeof pedido.id).toBe('number');
    expect(typeof pedido.nome).toBe('string');
    expect(typeof pedido.email).toBe('string');
    expect(pedido.itens === null || Array.isArray(pedido.itens)).toBeTruthy();

    if (Array.isArray(pedido.itens)) {
        for (const item of pedido.itens) {
            expect(typeof item).toBe('object');
            expect(typeof item.nome).toBe('string');
            expect(typeof item.quantidade).toBe('number');
            expect(typeof item.price).toBe('number');
        }
    }
}