import { test, expect } from 'vitest';

import {  } from '../../../../src/model/centrality/CentralityFactoryMethod';
import { GraphFactoryMethod } from '../../../../src/model/graph/GraphFactoryMethod';

// --------------------------------------
// Create Graph with content
// --------------------------------------

test('GraphFactoryMethod::create() : EdgeGraph', () => {
    const line = '1 2';
    const content = '';

    const graph = GraphFactoryMethod.create(line, content);

    expect(graph).toBeDefined();
    expect(graph.constructor.name).toBe('EdgeGraph');
});

test('GraphFactoryMethod::create() : MatrixMarketGraph', () => {
    const line = '%%MatrixMarket';
    const content = '';

    const graph = GraphFactoryMethod.create(line, content);

    expect(graph).toBeDefined();
    expect(graph.constructor.name).toBe('MatrixMarketGraph');
});

test('GraphFactoryMethod::create() : AdjacencyGraph', () => {
    const line = '0 1 1';
    const content = '0 1 1\n1 0 0\n1 0 0';

    const graph = GraphFactoryMethod.create(line, content);

    expect(graph).toBeDefined();
    expect(graph.constructor.name).toBe('AdjacencyGraph');
});

test('GraphFactoryMethod::create() : Unsupported graph', () => {
    const line = 'This is an invalid graph';
    const content = '';

    expect(() => { GraphFactoryMethod.create(line, content); }).toThrow(
        'InvalidGraph :: Passed graph is not supported'
    );
});

// --------------------------------------
// Create Empty Graph
// --------------------------------------

test('GraphFactoryMethod::createWithType() : EdgeGraph', () => {
    const graph = GraphFactoryMethod.createWithType('EdgeGraph');

    expect(graph).toBeDefined();
    expect(graph.constructor.name).toBe('EdgeGraph');
});

test('GraphFactoryMethod::createWithType() : MatrixMarketGraph', () => {
    const graph = GraphFactoryMethod.createWithType('MatrixMarketGraph');

    expect(graph).toBeDefined();
    expect(graph.constructor.name).toBe('MatrixMarketGraph');
});

test('GraphFactoryMethod::createWithType() : AdjacencyGraph', () => {
    const graph = GraphFactoryMethod.createWithType('AdjacencyGraph');

    expect(graph).toBeDefined();
    expect(graph.constructor.name).toBe('AdjacencyGraph');
});

test('GraphFactoryMethod::createWithType() : Unsupported graph', () => {
    expect(() => { GraphFactoryMethod.createWithType(''); }).toThrow(
        'InvalidGraph :: Passed graph is not supported'
    );
});
