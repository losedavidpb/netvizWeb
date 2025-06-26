import { test, expect } from 'vitest';

import { CentralityType } from '../../../../src/model/Centrality';
import { CentralityFactoryMethod } from '../../../../src/model/centrality/CentralityFactoryMethod';
import { Config } from '../../../../src/Config';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable test mode to avoid WebGL dependencies
Config.testMode = true;

// --------------------------------------
// Create Centrality
// --------------------------------------

test('CentralityFactoryMethod::createCentrality() : Betweenness', async () => {
    const type = CentralityType.Betweenness;

    const algorithm = await CentralityFactoryMethod.createCentrality(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('Betweenness');
});

test('CentralityFactoryMethod::createCentrality() : DegreeCentrality', async () => {
    const type = CentralityType.DegreeCentrality;

    const algorithm = await CentralityFactoryMethod.createCentrality(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('DegreeCentrality');
});

test('CentralityFactoryMethod::createCentrality() : DistanceCentrality', async () => {
    const type = CentralityType.DistanceCentrality;

    const algorithm = await CentralityFactoryMethod.createCentrality(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('DistanceCentrality');
});

test('CentralityFactoryMethod::createCentrality() : Unsupported centrality', async () => {
    const type = -1 as any;

    await expect(CentralityFactoryMethod.createCentrality(type)).rejects.toThrow(
        'InvalidCentrality :: Passed centrality is not supported'
    );
});
