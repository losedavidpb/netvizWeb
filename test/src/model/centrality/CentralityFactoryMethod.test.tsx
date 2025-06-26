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

test('CentralityFactoryMethod::createCentrality() : Betweenness', () => {
    const type = CentralityType.Betweenness;

    const algorithm = CentralityFactoryMethod.createCentrality(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('Betweenness');
});

test('CentralityFactoryMethod::createCentrality() : DegreeCentrality', () => {
    const type = CentralityType.DegreeCentrality;

    const algorithm = CentralityFactoryMethod.createCentrality(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('DegreeCentrality');
});

test('CentralityFactoryMethod::createCentrality() : DistanceCentrality', () => {
    const type = CentralityType.DistanceCentrality;

    const algorithm = CentralityFactoryMethod.createCentrality(type);

    expect(algorithm).toBeDefined();
    expect(algorithm.constructor.name).toBe('DistanceCentrality');
});

test('CentralityFactoryMethod::createCentrality() : Unsupported centrality', async () => {
    const type = -1 as any;

    expect(() => { CentralityFactoryMethod.createCentrality(type); }).toThrow(
        'InvalidCentrality :: Passed centrality is not supported'
    );
});
