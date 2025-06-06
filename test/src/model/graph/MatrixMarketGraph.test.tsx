import { test, expect } from 'vitest';
import path from 'path';

import { MatrixMarketGraph } from '../../../../src/model/graph/MatrixMarketGraph';
import { Graph } from '../../../../src/model/Graph';
import { Vertex } from '../../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Graph.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const MATRIX_MARKET_PATH = path.join(CASES_WORKPLACE, 'matrix_market/');

function attach_point(v0: Vertex, v1: Vertex): void {
    v0.attachPoint(v1);
    v0.updateDegree();
    v1.updateDegree();
}

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

test('MatrixMarketGraph::read() : No Coordinate', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_no_coordinate.mtx');
    expect(() => { new MatrixMarketGraph(filePath); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : No Pattern', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_no_pattern.mtx');
    expect(() => { new MatrixMarketGraph(filePath); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : No Symmetric', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_no_symmetric.mtx');
    expect(() => { new MatrixMarketGraph(filePath); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : 6 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_m_6.mtx');
    const graph = new MatrixMarketGraph(filePath);

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

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});

test('MatrixMarketGraph::read() : 12 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_m_10.mtx');
    const graph = new MatrixMarketGraph(filePath);

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

    expect(graph.getAdjacencyMatrix()).toStrictEqual(expectedAdjacencyMatrix);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getEdges()).toStrictEqual(expectedEdges);
});
