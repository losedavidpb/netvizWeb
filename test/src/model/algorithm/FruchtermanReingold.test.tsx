import { test, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

import { FruchtermanReingold } from '../../../../src/model/algorithm/FruchtermanReingold';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Graph } from '../../../../src/model/Graph';
import type { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const FRUCHTERMAN_REINGOLD = path.join(CASES_WORKPLACE, 'fruchterman_reingold');

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
function test_vertex_movement(initial: Vertex[], after: Vertex[]): void {
    expect(initial.length).toBe(after.length);

    for (let i = 0; i < initial.length; i++) {
        const posBefore = initial[i].getPos();
        const posAfter = after[i].getPos();

        const dx = posAfter.x - posBefore.x;
        const dy = posAfter.y - posBefore.y;

        const moved = Math.hypot(dx, dy) > 1e-6;
        expect(moved).toBe(true);
    }
}

// Check the placement of the vertices
function test_place(vertices: Vertex[], expected_length: number): void {
    expect(vertices.length).toBe(expected_length);

    const [W, L] = [FruchtermanReingold.W, FruchtermanReingold.L];

    for (let i = 0; i < vertices.length; i++) {
        let pos = vertices[i].getPos();

        expect(pos.x >= -W / 2 && pos.x < W / 2).toBe(true);
        expect(pos.y >= -L / 2 && pos.y < L / 2).toBe(true);
        expect(pos.z).toBe(0);
    }
}

// --------------------------------------
// apply
// --------------------------------------

test('FruchtermanReingold::apply() : Empty graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = load_test_graph(filePath);
    const algorithm = new FruchtermanReingold(graph);
    algorithm.apply();

    const vertices = graph.getVertices();
    const edges = graph.getEdges();

    expect(vertices.length).toBe(0);
    expect(edges.length).toBe(0);
});

test('FruchtermanReingold::apply() : 1x1 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_1x1.txt');

    const graph = load_test_graph(filePath);

    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    const init_vtx = get_init_vertices(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    expect(vertices.length).toBe(init_vtx.length);
    expect(vertices.length).toBe(1);

    expect(init_vtx[0].getPos().equals(vertices[0].getPos())).toBe(true);
});

test('FruchtermanReingold::apply() : 3x3 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_3x3.txt');

    const graph = load_test_graph(filePath);
    const init_vtx = get_init_vertices(graph);

    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    algorithm.apply();
    const vertices = graph.getVertices();

    test_vertex_movement(init_vtx, vertices);
});

test('FruchtermanReingold::apply() : 6x6 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_6x6.txt');

    const graph = load_test_graph(filePath);
    const init_vtx = get_init_vertices(graph);

    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    algorithm.apply();
    const vertices = graph.getVertices();

    test_vertex_movement(init_vtx, vertices);
});

// --------------------------------------
// place
// --------------------------------------

test('FruchtermanReingold::place() : Empty graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_empty.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    const edges = graph.getEdges();

    expect(vertices.length).toBe(0);
    expect(edges.length).toBe(0);
});

test('FruchtermanReingold::place() : 1x1 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_1x1.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    test_place(vertices, 1);
});

test('FruchtermanReingold::place() : 3x3 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_3x3.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    test_place(vertices, 3);
});

test('FruchtermanReingold::place() : 6x6 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_6x6.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    const vertices = graph.getVertices();
    test_place(vertices, 6);
});