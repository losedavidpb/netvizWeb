import { test, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

import { Graph } from '../../../../src/model/Graph';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { MultiForce } from '../../../../src/model/algorithm/MultiForce';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable test mode to avoid WebGL dependencies
Graph.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const MULTI_FORCE = path.join(CASES_WORKPLACE, 'multi_force');

// --------------------------------------
// placement
// --------------------------------------

test('MultiForce::placement() : Empty graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('MultiForce::placement() : 1x1 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_1x1.txt');
    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(1);

    for (let j = 0; j < vertices.length; ++j) {
        const pos = vertices[j].getPos();

        expect(pos.x).toBe(1);
        expect(pos.y).toBe(1);
        expect(pos.z).toBe(-9999990);
    }
});

test('MultiForce::placement() : 3x3 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_3x3.txt');
    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(3);

    for (let j = 0; j < vertices.length; ++j) {
        const pos = vertices[j].getPos();

        expect(pos.x).toBe(1);
        expect(pos.y).toBe(1);
        expect(pos.z).toBe(-9999990);
    }
});

test('MultiForce::placement() : 6x6 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_6x6.txt');
    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(6);

    for (let j = 0; j < vertices.length; ++j) {
        const pos = vertices[j].getPos();

        expect(pos.x).toBe(1);
        expect(pos.y).toBe(1);
        expect(pos.z).toBe(-9999990);
    }
});

// --------------------------------------
// place
// --------------------------------------

test('MultiForce::place() : Empty graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('MultiForce::place() : 1x1 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_1x1.txt');
    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(1);

    for (let j = 0; j < vertices.length; ++j) {
        const pos = vertices[j].getPos();

        expect(pos.x).toBe(1);
        expect(pos.y).toBe(1);
        expect(pos.z).toBe(-9999990);
    }
});

test('MultiForce::place() : 3x3 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_3x3.txt');
    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    const edges = graph.getEdges();

    expect(vertices.length).toBe(3);
    expect(edges.length).toBe(2);

    const [W, L] = [MultiForce.W, MultiForce.L];
    let placed = 0;

    for (let i = 0; i < vertices.length; ++i) {
        const pos = vertices[i].getPos();

        if (pos.z === 0) {
            placed++;

            expect(pos.x).toBeGreaterThanOrEqual(-W / 2);
            expect(pos.x).toBeLessThan(W / 2);
            expect(pos.y).toBeGreaterThanOrEqual(-L / 2);
            expect(pos.y).toBeLessThan(L / 2);
        } else {
            expect(pos.x).toBe(1);
            expect(pos.y).toBe(1);
            expect(pos.z).toBe(-9999990);
        }
    }

    expect(placed).toBeGreaterThan(0);
});

test('MultiForce::place() : 6x6 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_6x6.txt');
    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    const edges = graph.getEdges();

    expect(vertices.length).toBe(6);
    expect(edges.length).toBe(7);

    const [W, L] = [MultiForce.W, MultiForce.L];
    let placed = 0;

    for (let i = 0; i < vertices.length; ++i) {
        const pos = vertices[i].getPos();

        if (pos.z === 0) {
            placed++;

            expect(pos.x).toBeGreaterThanOrEqual(-W / 2);
            expect(pos.x).toBeLessThan(W / 2);
            expect(pos.y).toBeGreaterThanOrEqual(-L / 2);
            expect(pos.y).toBeLessThan(L / 2);
        } else {
            expect(pos.x).toBe(1);
            expect(pos.y).toBe(1);
            expect(pos.z).toBe(-9999990);
        }
    }

    expect(placed).toBeGreaterThan(0);
});

// --------------------------------------
// apply
// --------------------------------------

test('MultiForce::apply() : Empty graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.apply();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('MultiForce::apply() : 1x1 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_1x1.txt');

    const graph = new AdjacencyGraph(filePath);

    const algorithm = new MultiForce(graph);
    algorithm.apply();

    const vertices = graph.getVertices();
    const edges = graph.getEdges();

    expect(vertices.length).toBe(1);
    expect(edges.length).toBe(0);

    for (let j = 0; j < vertices.length; ++j) {
        const pos = vertices[j].getPos();

        expect(pos.x).toBe(1);
        expect(pos.y).toBe(1);
        expect(pos.z).toBe(-9999990);
    }
});

// ......
// TODO: Include tests for 3x3 and 6x6 graphs
// ......