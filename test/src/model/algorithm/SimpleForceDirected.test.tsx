import { test, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

import { SimpleForceDirected } from '../../../../src/model/algorithm/SimpleForceDirected';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Graph } from '../../../../src/model/Graph';
import type { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const SIMPLE_FORCE_DIRECTED = path.join(CASES_WORKPLACE, 'simple_force_directed');

// Mock window.crypto for tests (Node.js environment)
Object.defineProperty(global, 'window', {
    value: {
        crypto: {
            getRandomValues: (array: Uint32Array) => {
                for (let i = 0; i < array.length; i++) {
                    array[i] = Math.floor(Math.random() * 0xFFFFFFFF);
                }

                return array;
            }
        }
    },
    writable: true,
});

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

// Check the placement of the vertices
function test_place(vertices: Vertex[], exp_v: number): void {
    expect(vertices.length).toBe(exp_v);

    for (let i = 0; i < vertices.length; i++) {
        let pos = vertices[i].getPos();

        expect(pos.x >= -vertices.length / 2 && pos.x < vertices.length / 2).toBe(true);
        expect(pos.y >= -vertices.length / 2 && pos.y < vertices.length / 2).toBe(true);
        expect(pos.z).toBe(0);
    }
}

// --------------------------------------
// apply
// --------------------------------------

test('SimpleForceDirected::apply() : Empty graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);
    algorithm.apply();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('SimpleForceDirected::apply() : 1x1 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_1x1.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);

    algorithm.place();

    const init_vtx = get_init_vertices(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    expect(vertices.length).toBe(init_vtx.length);
    expect(vertices.length).toBe(1);

    expect(vertices[0].getPos().equals(init_vtx[0].getPos())).toBe(true);
});

test('SimpleForceDirected::apply() : 3x3 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_3x3.txt');

    const graph = load_test_graph(filePath);
    const init_vtx = get_init_vertices(graph);

    const algorithm = new SimpleForceDirected(graph);
    algorithm.place();

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply_effect(vertices, init_vtx);
});

test('SimpleForceDirected::apply() : 6x6 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_6x6.txt');

    const graph = load_test_graph(filePath);
    const init_vtx = get_init_vertices(graph);

    const algorithm = new SimpleForceDirected(graph);
    algorithm.place();

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply_effect(vertices, init_vtx);
});

// --------------------------------------
// place
// --------------------------------------

test('SimpleForceDirected::place() : Empty graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_empty.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

test('SimpleForceDirected::place() : 1x1 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_1x1.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    test_place(vertices, 1);
});

test('SimpleForceDirected::place() : 3x3 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_3x3.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    test_place(vertices, 3);
});

test('SimpleForceDirected::place() : 6x6 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_6x6.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    test_place(vertices, 6);
});