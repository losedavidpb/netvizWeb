import { test, expect } from 'vitest';

import { Centrality } from '../../../src/model/Centrality';
import type { Graph } from '../../../src/model/Graph';

// Mockup Centrality algorithm
class MockupCentrality extends Centrality {
    static HSVtoRGB(h: number, s: number, v: number): [r: number, g: number, b: number] {
        return Centrality.HSVtoRGB(h, s, v);
    }

    static normalize(x: number, max: number, min: number): number {
        return Centrality.normalize(x, max, min);
    }

    apply(_graph: Graph): void {
        // . . .
    }
}

// --------------------------------------
// HSVtoRGB
// --------------------------------------

test('Centrality::HSVtoRGB() : Invalid H', () => {
    const [h1, s1, v1] = [-1, 0, 0];
    const [h2, s2, v2] = [361, 0, 0];

    expect(() => { MockupCentrality.HSVtoRGB(h1, s1, v1); }).toThrow(
        "InvalidHSV :: Color values are not valid"
    );

    expect(() => { MockupCentrality.HSVtoRGB(h2, s2, v2); }).toThrow(
        "InvalidHSV :: Color values are not valid"
    );
});

test('Centrality::HSVtoRGB() : Invalid S', () => {
    const [h1, s1, v1] = [0, -1, 0];
    const [h2, s2, v2] = [0, 2, 0];

    expect(() => { MockupCentrality.HSVtoRGB(h1, s1, v1); }).toThrow(
        "InvalidHSV :: Color values are not valid"
    );

    expect(() => { MockupCentrality.HSVtoRGB(h2, s2, v2); }).toThrow(
        "InvalidHSV :: Color values are not valid"
    );
});

test('Centrality::HSVtoRGB() : Invalid V', () => {
    const [h1, s1, v1] = [0, 0, -1];
    const [h2, s2, v2] = [0, 0, 2];

    expect(() => { MockupCentrality.HSVtoRGB(h1, s1, v1); }).toThrow(
        "InvalidHSV :: Color values are not valid"
    );

    expect(() => { MockupCentrality.HSVtoRGB(h2, s2, v2); }).toThrow(
        "InvalidHSV :: Color values are not valid"
    );
});

test('Centrality::HSVtoRGB() : Zero Saturation returns grayscale', () => {
    const [h, s, v] = [10, 0, 0.2];
    const expected = [0.2, 0.2, 0.2];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

test('Centrality::HSVtoRGB() : Red (Hue=0)', () => {
    const [h, s, v] = [0, 1, 1];
    const expected = [1, 0, 0];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

test('Centrality::HSVtoRGB() : Yellow (Hue=60)', () => {
    const [h, s, v] = [60, 1, 1];
    const expected = [1, 1, 0];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

test('Centrality::HSVtoRGB() : Green (Hue=120)', () => {
    const [h, s, v] = [120, 1, 1];
    const expected = [0, 1, 0];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

test('Centrality::HSVtoRGB() : Cyan (Hue=180)', () => {
    const [h, s, v] = [180, 1, 1];
    const expected = [0, 1, 1];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

test('Centrality::HSVtoRGB() : Blue (Hue=240)', () => {
    const [h, s, v] = [240, 1, 1];
    const expected = [0, 0, 1];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

test('Centrality::HSVtoRGB() : Magenta (Hue=300)', () => {
    const [h, s, v] = [300, 1, 1];
    const expected = [1, 0, 1];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

test('Centrality::HSVtoRGB() : White (Zero saturation, max brightness)', () => {
    const [h, s, v] = [0, 0, 1];
    const expected = [1, 1, 1];

    expect(MockupCentrality.HSVtoRGB(h, s, v)).toStrictEqual(expected);
});

// --------------------------------------
// Normalize
// --------------------------------------

test('Centrality::normalize() : Valid Normalization', () => {
    expect(MockupCentrality.normalize(15, 20, 10)).toBe(0.5);
});

test('Centrality::normalize() : Invalid [max, min]', () => {
    expect(() => {
        MockupCentrality.normalize(15, 10, 20);
    }).toThrow(
        "InvalidMaxMin :: Maximum value is less than the minimum value"
    );
});
