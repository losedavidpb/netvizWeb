import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Graph } from '../../../../src/model/Graph';
import { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Graph.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const ADJACENCY_PATH = path.join(CASES_WORKPLACE, 'adjacency/');

// --------------------------------------
// Read
// --------------------------------------

function load_test_graph(filePath: string): Graph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new AdjacencyGraph(content);
}

function attach_point(v0: Vertex, v1: Vertex): void {
    v0.attachPoint(v1);
    v0.updateDegree();
    v1.updateDegree();
}

test('AdjacencyGraph::read() : Empty graph', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix: number[][] = [];

    // Expected Vertices
    const expectedVertices: Vertex[] = [];

    // Expected Edges
    const expectedEdges: [number, number][] = [];

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});

test('AdjacencyGraph::read() : Matrix 1x1', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_1x1.txt');
    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix: number[][] = [[0]];

    // Expected Vertices
    const expectedVertices = [new Vertex(0, 0, 0)];

    // Expected Edges
    const expectedEdges: [number, number][] = [];

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});

test('AdjacencyGraph::read() : Non-simetric Matrix whit invalid ncols', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_invalid_ncol.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new AdjacencyGraph(content) }).toThrow(
        "InvalidAdjacencyMatrix :: Adjacency Matrix must be simetric"
    );
});

test('AdjacencyGraph::read() : Non-simetric Matrix whit invalid nrows', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_invalid_nrow.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new AdjacencyGraph(content) }).toThrow(
        "InvalidAdjacencyMatrix :: Adjacency Matrix must be simetric"
    );
});

test('AdjacencyGraph::read() : Matrix whit invalid values', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_invalid_values.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new AdjacencyGraph(content) }).toThrow(
        "InvalidAdjacencyMatrix :: Adjacency Matrix must have binary values"
    );
});

test('AdjacencyGraph::read() : Matrix 3x3', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_3x3.txt');
    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1], [1, 0, 0], [1, 0, 0],
    ];

    // Expected Vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0),
    ];

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);

    // Expected Edges
    const expectedEdges = [
        [0, 1], [0, 2],
    ];

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});

test('AdjacencyGraph::read() : Matrix 6x6', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_6x6.txt');
    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0],
        [1, 0, 0, 1, 1, 0], [0, 1, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1], [0, 0, 0, 1, 1, 0],
    ];

    // Expected vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[3]);
    attach_point(expectedVertices[2], expectedVertices[3]);
    attach_point(expectedVertices[2], expectedVertices[4]);
    attach_point(expectedVertices[3], expectedVertices[5]);
    attach_point(expectedVertices[4], expectedVertices[5]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [1, 3], [2, 3],
        [2, 4], [3, 5], [4, 5]
    ];

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});