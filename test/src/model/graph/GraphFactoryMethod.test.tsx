import { test, expect } from 'vitest';

import {  } from '../../../../src/model/centrality/CentralityFactoryMethod';
import { Config } from '../../../../src/Config';
import { GraphFactoryMethod } from '../../../../src/model/graph/GraphFactoryMethod';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable test mode to avoid WebGL dependencies
Config.testMode = true;

// --------------------------------------
// Create Graph
// --------------------------------------

test('GraphFactoryMethod::createGraph() : EdgeGraph', async () => {
    const line = '1 2';
    const content = '';

    const algorithm = await GraphFactoryMethod.createGraph(line, content);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('EdgeGraph');
});

test('GraphFactoryMethod::createGraph() : MatrixMarketGraph', async () => {
    const line = '%%MatrixMarket';
    const content = '';

    const algorithm = await GraphFactoryMethod.createGraph(line, content);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('MatrixMarketGraph');
});

test('GraphFactoryMethod::createGraph() : AdjacencyGraph', async () => {
    const line = '0 1 1';
    const content = '0 1 1\n1 0 0\n1 0 0';

    const algorithm = await GraphFactoryMethod.createGraph(line, content);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('AdjacencyGraph');
});

test('GraphFactoryMethod::createGraph() : Unsupported graph', async () => {
    const line = 'This is an invalid graph';
    const content = '';

    await expect(GraphFactoryMethod.createGraph(line, content)).rejects.toThrow(
        'InvalidGraph :: Passed graph is not supported'
    );
});
