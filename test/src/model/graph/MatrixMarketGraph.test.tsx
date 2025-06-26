import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { MatrixMarketGraph } from '../../../../src/model/graph/MatrixMarketGraph';
import { Vertex } from '../../../../src/model/Vertex';
import { Config } from '../../../../src/Config';
import type { Graph } from '../../../../src/model/Graph';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Config.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const MATRIX_MARKET_PATH = path.join(CASES_WORKPLACE, 'matrix_market/');

// Load the graph to be tested
function load_test_graph(filePath: string): MatrixMarketGraph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new MatrixMarketGraph(content);
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

// Default error message
function error_message(): string {
    return (
        "MatrixMarket :: Sorry, this application only supports graphs that are:\n" +
        "\tMatrix Market type: [coordinate][pattern][symmetric]\n" +
        "\tand not: [integer]\n"
    );
}

// --------------------------------------
// Read
// --------------------------------------

test('MatrixMarketGraph::read() : Empty graph', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_empty.mtx');
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

test('MatrixMarketGraph::read() : No Coordinate', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_no_coordinate.mtx');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new MatrixMarketGraph(content); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : No Pattern', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_no_pattern.mtx');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new MatrixMarketGraph(content); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : No Symmetric', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_no_symmetric.mtx');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new MatrixMarketGraph(content); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : 6 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_6.mtx');
    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 0], [1, 0, 1, 1],
        [1, 1, 0, 1], [0, 1, 1, 0]
    ];

    // Expected vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[2], expectedVertices[0]);
    attach_point(expectedVertices[3], expectedVertices[1]);
    attach_point(expectedVertices[2], expectedVertices[1]);
    attach_point(expectedVertices[2], expectedVertices[3]);
    attach_point(expectedVertices[1], expectedVertices[3]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [1, 2],
        [1, 3], [2, 3]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

test('MatrixMarketGraph::read() : 12 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_10.mtx');
    const graph = load_test_graph(filePath);

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    ];

    // Expected vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[3]);
    attach_point(expectedVertices[1], expectedVertices[4]);
    attach_point(expectedVertices[2], expectedVertices[5]);
    attach_point(expectedVertices[3], expectedVertices[6]);
    attach_point(expectedVertices[4], expectedVertices[7]);
    attach_point(expectedVertices[5], expectedVertices[8]);
    attach_point(expectedVertices[6], expectedVertices[9]);
    attach_point(expectedVertices[7], expectedVertices[8]);
    attach_point(expectedVertices[8], expectedVertices[9]);
    attach_point(expectedVertices[0], expectedVertices[9]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [0, 9],
        [1, 3], [1, 4], [2, 5],
        [3, 6], [4, 7], [5, 8],
        [6, 9], [7, 8], [8, 9]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});