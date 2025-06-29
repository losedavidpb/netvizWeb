import { test, expect } from 'vitest';

import { AlgorithmFactoryMethod } from '../../../../src/model/algorithm/AlgorithmFactoryMethod';
import { AlgorithmType } from '../../../../src/model/Algorithm';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Config } from '../../../../src/Config';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable test mode to avoid WebGL dependencies
Config.testMode = true;

// --------------------------------------
// Create Algorithm
// --------------------------------------

test('AlgorithmFactoryMethod::create() : FruchtermanReingold', () => {
    const type = AlgorithmType.FruchtermanReingold;
    const graph = new AdjacencyGraph('');

    const algorithm = AlgorithmFactoryMethod.create(type, graph);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('FruchtermanReingold');
});

test('AlgorithmFactoryMethod::create() : MultiForce', () => {
    const type = AlgorithmType.MultiForce;
    const graph = new AdjacencyGraph('');

    const algorithm = AlgorithmFactoryMethod.create(type, graph);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('MultiForce');
});

test('AlgorithmFactoryMethod::create() : SimpleForceDirected', () => {
    const type = AlgorithmType.SimpleForceDirected;
    const graph = new AdjacencyGraph('');

    const algorithm = AlgorithmFactoryMethod.create(type, graph);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('SimpleForceDirected');
});

test('AlgorithmFactoryMethod::create() : Unsupported algorithm', async () => {
    const type = -1 as any;
    const graph = new AdjacencyGraph('');

    expect(() => { AlgorithmFactoryMethod.create(type, graph); }).toThrow(
        'InvalidAlgorithm :: Passed algorithm is not supported'
    );
});
