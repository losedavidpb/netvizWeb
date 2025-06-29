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

test('CentralityFactoryMethod::create() : Betweenness', () => {
    const type = CentralityType.Betweenness;

    const algorithm = CentralityFactoryMethod.create(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('Betweenness');
});

test('CentralityFactoryMethod::create() : DegreeCentrality', () => {
    const type = CentralityType.DegreeCentrality;

    const algorithm = CentralityFactoryMethod.create(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('DegreeCentrality');
});

test('CentralityFactoryMethod::create() : DistanceCentrality', () => {
    const type = CentralityType.DistanceCentrality;

    const algorithm = CentralityFactoryMethod.create(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('DistanceCentrality');
});

test('CentralityFactoryMethod::create() : Unsupported centrality', async () => {
    const type = -1 as any;

    expect(() => { CentralityFactoryMethod.create(type); }).toThrow(
        'InvalidCentrality :: Passed centrality is not supported'
    );
});
