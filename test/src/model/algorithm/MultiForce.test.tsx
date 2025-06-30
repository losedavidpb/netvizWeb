import { test, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

import { Graph } from '../../../../src/model/Graph';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { MultiForce } from '../../../../src/model/algorithm/MultiForce';
import type { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const MULTI_FORCE = path.join(CASES_WORKPLACE, 'multi_force');

// Load the graph to be tested
function load_test_graph(filePath: string): Graph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new AdjacencyGraph(content);
}

// Clone the vertices of the graph
function get_init_vertices(graph: Graph): Vertex[] {
    const init_vertices: Vertex[] = [];

    for (let vertex of graph.getVertices()) {
        init_vertices.push(vertex.clone());
    }

    return init_vertices;
}

// Check that vertices are placed as expected
function test_placement(vertices: Vertex[], exp_v: number): void {
    expect(vertices.length).toBe(exp_v);

    for (let i = 0; i < vertices.length; ++i) {
        const pos = vertices[i].getPos();

        expect(pos.x).toBe(1);
        expect(pos.y).toBe(1);
        expect(pos.z).toBe(0);
    }
}

// Check that vertices are placed as expected
function test_place(vertices: Vertex[], exp_v: number, edges: number[][], exp_e: number): void {
    expect(vertices.length).toBe(exp_v);
    expect(edges.length).toBe(exp_e);

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
            expect(pos.z).toBe(0);
        }
    }

    expect(placed).toBeGreaterThan(0);
}

// Check that the vertices have moved after apply
function test_apply_effect(vertices: Vertex[], init_vtx: Vertex[]): void {
    expect(init_vtx.length).toBe(vertices.length);

    for (let i = 0; i < vertices.length; i++) {
        const old_pos = init_vtx[i].getPos();
        const new_pos = vertices[i].getPos();

        const moved = old_pos.x !== new_pos.x || old_pos.y !== new_pos.y;
        expect(moved).toBe(true);

        expect(Number.isFinite(new_pos.x)).toBe(true);
        expect(Number.isFinite(new_pos.y)).toBe(true);
        expect(new_pos.z).toBe(0);
    }
}

// --------------------------------------
// placement
// --------------------------------------

test('MultiForce::placement() : Empty graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('MultiForce::placement() : 1x1 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_1x1.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    test_placement(vertices, 1);
});

test('MultiForce::placement() : 3x3 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_3x3.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    test_placement(vertices, 3);
});

test('MultiForce::placement() : 6x6 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_6x6.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.placement();

    const vertices = graph.getVertices();
    test_placement(vertices, 6);
});

// --------------------------------------
// place
// --------------------------------------

test('MultiForce::place() : Empty graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('MultiForce::place() : 1x1 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_1x1.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    test_placement(vertices, 1);
});

test('MultiForce::place() : 3x3 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_3x3.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    const edges = graph.getEdges();

    test_place(vertices, 3, edges, 2);
});

test('MultiForce::place() : 6x6 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_6x6.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    const edges = graph.getEdges();

    test_place(vertices, 6, edges, 7);
});

// --------------------------------------
// apply
// --------------------------------------

test('MultiForce::apply() : Empty graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);
    algorithm.apply();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('MultiForce::apply() : 1x1 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_1x1.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);

    const init_vtx = graph.getVertices();
    algorithm.apply();

    const vertices = graph.getVertices();

    expect(vertices.length).toBe(init_vtx.length);
    expect(vertices.length).toBe(1);

    expect(vertices[0].getPos().equals(init_vtx[0].getPos())).toBe(true);
});

test('MultiForce::apply() : 3x3 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_3x3.txt');

    const graph = load_test_graph(filePath);
    const init_vtx = get_init_vertices(graph);
    const algorithm = new MultiForce(graph);

    algorithm.apply();

    const vertices = graph.getVertices();

    test_apply_effect(vertices, init_vtx);
});

test('MultiForce::apply() : 6x6 graph', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_6x6.txt');

    const graph = load_test_graph(filePath);
    let init_vtx = get_init_vertices(graph);
    const algorithm = new MultiForce(graph);

    algorithm.apply();

    const vertices = graph.getVertices();

    test_apply_effect(vertices, init_vtx);
});

test('MultiForce::apply() : edgeIndex >= edges.length', () => {
    const filePath = path.join(MULTI_FORCE, 'test_multi_force_3x3.txt');
    const graph = load_test_graph(filePath);
    const algorithm = new MultiForce(graph);

    (algorithm as any).edgeIndex = graph.getEdges().length + 10;
    expect(() => algorithm.apply()).not.toThrow();

    const vertices = graph.getVertices();

    for (const vertex of vertices) {
        const pos = vertex.getPos();

        expect(Number.isFinite(pos.x)).toBe(true);
        expect(Number.isFinite(pos.y)).toBe(true);
        expect(pos.z).toBe(0);
    }
});
