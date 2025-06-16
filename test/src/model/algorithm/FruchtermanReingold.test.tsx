import { test, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as THREE from 'three';

import { FruchtermanReingold } from '../../../../src/model/algorithm/FruchtermanReingold';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Graph } from '../../../../src/model/Graph';
import type { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable test mode to avoid WebGL dependencies
Graph.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const FRUCHTERMAN_REINGOLD = path.join(CASES_WORKPLACE, 'fruchterman_reingold');

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

function get_init_edges(graph: Graph): number[][] {
    const result: number[][] = [];
    const edges = graph.getEdges();

    for (let i = 0; i < edges.length; i++) {
        result.push([]);

        for (let j = 0; j < edges[i].length; j++) {
            result[i].push(edges[i][j]);
        }
    }

    return result;
}

function get_expected_force(i: number, vertices: Vertex[], edges: number[][]): THREE.Vector3 {
    let force = new THREE.Vector3();

    const v0 = vertices[i];
    const k = Math.sqrt(FruchtermanReingold.area / vertices.length);

    for (let j = 0; j < vertices.length; j++) {
        const v1 = vertices[j];

        if (i !== j) {
            let dx = v0.getPos().x - v1.getPos().x;
            let dy = v0.getPos().y - v1.getPos().y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.00000000002) dist = 0.00000000002;

            const repulsion = (k * k) / dist;
            force.x += (dx / dist) * repulsion;
            force.y += (dy / dist) * repulsion;
        }
    }

    for (let j = 0; j < edges.length; j++) {
        const edge = edges[j];

        if (edge[0] === i || edge[1] === i) {
            const indx = (edge[0] === i) ? edge[1] : edge[0];
            const v1 = vertices[indx];

            let dx = v0.getPos().x - v1.getPos().x;
            let dy = v0.getPos().y - v1.getPos().y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.00000000002) dist = 0.00000000002;

            const attraction = (dist * dist) / k;
            force.x -= (dx / dist) * attraction;
            force.y -= (dy / dist) * attraction;
        }
    }

    return force;
}

function test_apply(vertices: Vertex[], init_vtx: Vertex[], init_edges: number[][]): void {
    expect(init_vtx.length).toBe(vertices.length);

    for (let i = 0; i < vertices.length; i++) {
        const init_pos = init_vtx[i].getPos();
        const init_force = get_expected_force(i, init_vtx, init_edges);

        const pos = vertices[i].getPos();
        const force = vertices[i].getForce();

        expect(force.x).toBe(init_force.x);
        expect(force.y).toBe(init_force.y);
        expect(force.z).toBe(0);

        expect(pos.x).toBe(init_pos.x + force.x * 0.0015);
        expect(pos.y).toBe(init_pos.y + force.y * 0.0015);
        expect(pos.z).toBe(0);
    }
}

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
    const init_edges = get_init_edges(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply(vertices, init_vtx, init_edges);
});

test('FruchtermanReingold::apply() : 3x3 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_3x3.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    const init_vtx = get_init_vertices(graph);
    const init_edges = get_init_edges(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply(vertices, init_vtx, init_edges);
});

test('FruchtermanReingold::apply() : 6x6 graph', () => {
    const filePath = path.join(FRUCHTERMAN_REINGOLD, 'test_fruchterman_6x6.txt');

    const graph = load_test_graph(filePath);
    const algorithm = new FruchtermanReingold(graph);
    algorithm.place();

    const init_vtx = get_init_vertices(graph);
    const init_edges = get_init_edges(graph);

    algorithm.apply();
    const vertices = graph.getVertices();

    test_apply(vertices, init_vtx, init_edges);
});

// --------------------------------------
// place
// --------------------------------------

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