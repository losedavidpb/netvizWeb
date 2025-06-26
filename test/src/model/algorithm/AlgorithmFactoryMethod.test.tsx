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

test('AlgorithmFactoryMethod::createAlgorithm() : FruchtermanReingold', async () => {
    const type = AlgorithmType.FruchtermanReingold;
    const graph = new AdjacencyGraph('');

    const algorithm = await AlgorithmFactoryMethod.createAlgorithm(type, graph);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('FruchtermanReingold');
});

test('AlgorithmFactoryMethod::createAlgorithm() : MultiForce', async () => {
    const type = AlgorithmType.MultiForce;
    const graph = new AdjacencyGraph('');

    const algorithm = await AlgorithmFactoryMethod.createAlgorithm(type, graph);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('MultiForce');
});

test('AlgorithmFactoryMethod::createAlgorithm() : SimpleForceDirected', async () => {
    const type = AlgorithmType.SimpleForceDirected;
    const graph = new AdjacencyGraph('');

    const algorithm = await AlgorithmFactoryMethod.createAlgorithm(type, graph);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('SimpleForceDirected');
});

test('AlgorithmFactoryMethod::createAlgorithm() : Unsupported algorithm', async () => {
    const type = -1 as any;
    const graph = new AdjacencyGraph('');

    await expect(AlgorithmFactoryMethod.createAlgorithm(type, graph)).rejects.toThrow(
        'InvalidAlgorithm :: Passed algorithm is not supported'
    );
});
