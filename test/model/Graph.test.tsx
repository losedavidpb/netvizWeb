import { test, expect } from 'vitest';

import { Graph } from '../../src/model/Graph';

// Enable testing to avoid WebGL checks
Graph.testMode = true;

// Mockup graph to test non-abstract methods
class MockGraph extends Graph {
    protected read(filePath: string): void {
        // ...
    }
}

// --------------------------------------
// Split
// --------------------------------------

test('Graph::split() : Empty String', () => {
    const tokens = Graph.split('');
    expect(tokens.length).toBe(0);
});

test('Graph::split() : One Number', () => {
    const tokens = Graph.split(' 1 ');
    expect(tokens.length).toBe(1);
    expect(tokens[0]).toBe(1);
});

test('Graph::split() : Several Numbers', () => {
    const tokens = Graph.split(' 1 2 3 4 5 6');
    const expected = [1, 2, 3, 4, 5, 6];

    expect(tokens.length).toBe(6);

    for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i]).toBe(expected[i]);
    }
});

test('Graph::split() : Invalid Numbers', () => {
    expect(() => {
        Graph.split(' 1 2 a 4 5 6');
    }).toThrow(
        "InvalidToken: 'a' is not a number"
    );
});

// --------------------------------------
// Hash
// --------------------------------------

test('Graph::hash() : Valid Hash', () => {
    const [h1, h2, h3] = [1, 2, 3];
    const expected = ((h1 * 2654435789) + h2) * 2654435789 + h3;

    expect(Graph.hash(h1, h2, h3)).toBe(expected);
});

test('Graph::hash() : Two Different Hash Codes', () => {
    expect(Graph.hash(1, 2, 3)).not.toBe(Graph.hash(3, 2, 1));
});


// --------------------------------------
// Vertices
// --------------------------------------

test('Graph::getVertices() : Default Vertices', () => {
    let graph = new MockGraph();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

// --------------------------------------
// Edges
// --------------------------------------

test('Graph::getEdges() : Default Edges', () => {
    let graph = new MockGraph();

    const edges = graph.getEdges();
    expect(edges.length).toBe(0);
});

// --------------------------------------
// AdjacencyMatrix
// --------------------------------------

test('Graph::getAdjacencyMatrix() : Default Adjaceny Matrix', () => {
    let graph = new MockGraph();

    const adjacencyMatrix = graph.getAdjacencyMatrix();
    expect(adjacencyMatrix.length).toBe(0);
});