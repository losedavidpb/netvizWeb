import { test, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as THREE from 'three';

import { SimpleForceDirected } from '../../../../src/model/algorithm/SimpleForceDirected';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Graph } from '../../../../src/model/Graph';
import type { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable test mode to avoid WebGL dependencies
Graph.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const SIMPLE_FORCE_DIRECTED = path.join(CASES_WORKPLACE, 'simple_force_directed');

function load_test_graph(filePath: string): Graph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new AdjacencyGraph(content);
}

// --------------------------------------
// apply
// --------------------------------------

function get_init_vertices(graph: Graph): Vertex[] {
    const init_vertices: Vertex[] = [];

    for (let vertex of graph.getVertices()) {
        init_vertices.push(vertex.clone());
    }

    return init_vertices;
}

function get_init_adj_matrix(graph: Graph): number[][] {
    const result: number[][] = [];
    const adjacency_matrix = graph.getAdjacencyMatrix();

    for (let i = 0; i < adjacency_matrix.length; i++) {
        result.push([]);

        for (let j = 0; j < adjacency_matrix[i].length; j++) {
            result[i].push(adjacency_matrix[i][j]);
        }
    }

    return result;
}

function get_expected_force(i: number, vertices: Vertex[], adjacency_matrix: number[][]): THREE.Vector3 {
    let force = new THREE.Vector3(0, 0, 0);

    const v0 = vertices[i];

    for (let j = 0; j < vertices.length; ++j) {
        const v1 = vertices[j];

        if (i != j) {
            const dx = v0.getPos().x - v1.getPos().x;
            const dy = v0.getPos().y - v1.getPos().y;
            const rsq = 0.25 * (dx * dx + dy * dy);

            force.x += 10 * (dx / rsq);
            force.y += 10 * (dy / rsq);
        }
    }

    for (let j = 0; j < vertices.length; ++j) {
        const v1 = vertices[j];

        if (adjacency_matrix[i][j] === 1) {
            force.x += 4 * (v1.getPos().x - v0.getPos().x);
            force.y += 4 * (v1.getPos().y - v0.getPos().y);
        }
    }

    return force;
}

function test_apply(vertices: Vertex[], init_vtx: Vertex[], init_adj_matrix: number[][]): void {
    expect(init_vtx.length).toBe(vertices.length);

    for (let i = 0; i < vertices.length; i++) {
        const init_pos = init_vtx[i].getPos();
        const init_velocity = init_vtx[i].getVelocity();
        const init_force = get_expected_force(i, init_vtx, init_adj_matrix);

        const pos = vertices[i].getPos();
        const velocity = vertices[i].getVelocity();
        const force = vertices[i].getForce();

        expect(force.x).toBe(init_force.x);
        expect(force.y).toBe(init_force.y);
        expect(force.z).toBe(0);

        expect(velocity.x).toBe((init_velocity.x + force.x) * 0.01);
        expect(velocity.y).toBe((init_velocity.y + force.y) * 0.01);
        expect(velocity.z).toBe(0);

        expect(pos.x).toBe(init_pos.x + velocity.x);
        expect(pos.y).toBe(init_pos.y + velocity.y);
        expect(pos.z).toBe(0);
    }
}

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
    const init_adj_matrix = get_init_adj_matrix(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply(vertices, init_vtx, init_adj_matrix);
});

test('SimpleForceDirected::apply() : 3x3 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_3x3.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);

    algorithm.place();

    const init_vtx = get_init_vertices(graph);
    const init_adj_matrix = get_init_adj_matrix(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply(vertices, init_vtx, init_adj_matrix);
});

test('SimpleForceDirected::apply() : 6x6 graph', () => {
    const filePath = path.join(SIMPLE_FORCE_DIRECTED, 'test_force_6x6.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new SimpleForceDirected(graph);

    algorithm.place();

    const init_vtx = get_init_vertices(graph);
    const init_adj_matrix = get_init_adj_matrix(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply(vertices, init_vtx, init_adj_matrix);
});

// --------------------------------------
// place
// --------------------------------------

function test_place(vertices: Vertex[], exp_v: number): void {
    expect(vertices.length).toBe(exp_v);

    for (let i = 0; i < vertices.length; i++) {
        let pos = vertices[i].getPos();

        expect(pos.x >= -vertices.length / 2 && pos.x < vertices.length / 2).toBe(true);
        expect(pos.y >= -vertices.length / 2 && pos.y < vertices.length / 2).toBe(true);
        expect(pos.z).toBe(0);
    }
}

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