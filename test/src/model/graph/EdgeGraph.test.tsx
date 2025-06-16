import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { EdgeGraph } from '../../../../src/model/graph/EdgeGraph';
import { Graph } from '../../../../src/model/Graph';
import { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Graph.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const EDGE_PATH = path.join(CASES_WORKPLACE, 'edge_links/');

function attach_point(v0: Vertex, v1: Vertex): void {
    v0.attachPoint(v1);
    v0.updateDegree();
    v1.updateDegree();
}

function load_test_graph(filePath: string): Graph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new EdgeGraph(content);
}

// --------------------------------------
// Constructor
// --------------------------------------

test('EdgeGraph::constructor() : Cannot define both parameters', () => {
    expect(() => { new EdgeGraph('', []) }).toThrow(
        "InvalidParams :: Cannot define both params"
    );
});

test('EdgeGraph::constructor() : Edges of more than two vertices', () => {
    const newEdgeList = [[0, 2], [1, 0, 3], [2, 1]];

    expect(() => { new EdgeGraph(undefined, newEdgeList) }).toThrow(
        "InvalidEdge :: Edges can only have two linked vertices"
    );
});

test('EdgeGraph::constructor() : Graph is defined with EdgeList', () => {
    const newEdgeList = [ [0, 2], [1, 0], [2, 1] ];
    const graph = new EdgeGraph(undefined, newEdgeList);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1], [1, 0, 1], [1, 1, 0],
    ];

    // Expected Vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0),
    ];

    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[0]);
    attach_point(expectedVertices[2], expectedVertices[1]);

    // Expected Edges
    const expectedEdges = [
        [0, 1], [0, 2], [1, 2]
    ];

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});

// --------------------------------------
// Read
// --------------------------------------

test('EdgeGraph::read() : Empty graph', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_empty.txt');
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

test('EdgeGraph::read() : Edges of more than two vertices', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_invalid_ncol.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new EdgeGraph(content) }).toThrow(
        "InvalidEdge :: Edges can only have two linked vertices"
    );
});

test('EdgeGraph::read() : Edges with invalid values', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_invalid_values.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new EdgeGraph(content) }).toThrow(
        "InvalidToken: 'a' is not a number"
    );
});

test('EdgeGraph::read() : 3 edges', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_3.txt');
    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1], [1, 0, 1], [1, 1, 0],
    ];

    // Expected Vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0),
    ];

    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[0]);
    attach_point(expectedVertices[2], expectedVertices[1]);

    // Expected Edges
    const expectedEdges = [
        [0, 1], [0, 2], [1, 2]
    ];

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});

test('EdgeGraph::read() : 6 edges', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_6.txt');
    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 1, 1, 0], [1, 0, 1, 0, 0, 1],
        [1, 1, 0, 1, 0, 0], [1, 0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0],
    ];

    // Expected vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[0]);
    attach_point(expectedVertices[2], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[3]);
    attach_point(expectedVertices[3], expectedVertices[2]);
    attach_point(expectedVertices[4], expectedVertices[0]);
    attach_point(expectedVertices[5], expectedVertices[1]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [1, 5], [2, 3]
    ];

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});