import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { EdgeGraph } from '../../../../src/model/graph/EdgeGraph';
import { Vertex } from '../../../../src/model/Vertex';
import { Config } from '../../../../src/Config';
import type { Graph } from '../../../../src/model/Graph';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Config.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const EDGE_PATH = path.join(CASES_WORKPLACE, 'edge_links/');

// Load the graph to be tested
function load_test_graph(filePath: string): EdgeGraph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new EdgeGraph(content);
}

// Check whether the vertices are as expected
function test_graph(graph: Graph, expected_adj: number[][], expected_v: Vertex[], expected_edg: number[][]): void {
    expect(graph.getAdjacencyMatrix()).toStrictEqual(expected_adj);

    expect(graph.getNumEdges()).toBe(expected_edg.length);
    expect(graph.getEdges()).toStrictEqual(expected_edg);

    expect(graph.getVertices().length).toBe(expected_v.length);

    graph.getVertices().forEach((v, i) => {
        expect(v.equals(expected_v[i])).toBe(true);
    });
}

// Attach the point to the first vertex
function attach_point(v0: Vertex, v1: Vertex): void {
    v0.attachPoint(v1);
    v0.updateDegree();
    v1.updateDegree();
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

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
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

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
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

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
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

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});